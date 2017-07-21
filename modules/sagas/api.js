import { take, takeEvery, takeLatest, fork, cancel, call, put, cancelled, race, select } from 'redux-saga/effects'
import { asyncDoWork, asyncWorkInit, asyncWorkResolve, asyncWorkError } from '../store'

function* asyncWorker(action) {
  
  console.log('saga action', action)
  const { work, asyncRender, callback, RootCmp } = action.meta;

  if (!work) return;

  // An AsyncRender only cares about componentWillMount, no updates from store.
  if (!asyncRender) {

    // Updates global state with new key that's in the loading state
    for (let i =0; i < work.length; i++) {
      console.log('saga init action', work[i].key);
      yield put(asyncWorkInit(work[i].key));
    }
  }

  try {

    const workPromises = work.map(item => item.work()) 
    const results = yield call(() => Promise.all(workPromises));
    
    RootCmp.asyncWorkResolved = true;

    for (let i =0; i < work.length; i++) {
      yield put(asyncWorkResolve(work[i].key, results[i]));
    }

    if (callback) callback(results)

/*    const { cancelled, results } = yield race({
      results: call(client[reqType], endPoint),
      cancelled: take(fetchCancel)
    });
    
    console.log('race results', cancelled, results);
    yield cancelled ? cancel() : put(fetchSuccess(key, results));
*/
  }

  catch(error) {
    RootCmp.asyncWorkResolved = true;
    console.log('catch error', error)
    yield put(asyncWorkError(error))
  } 

  finally {
    console.log('finally')
/*    if (yield cancelled()) {
      console.log('fetch task cancelled', key);
    }*/
  }
}

export function* watchAsyncWork() {
  yield takeEvery(asyncDoWork, asyncWorker)
}