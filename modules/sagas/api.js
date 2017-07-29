import { all, take, takeEvery, takeLatest, fork, cancel, call, put, cancelled, race, select } from 'redux-saga/effects'
import { asyncDoWork, asyncWorkInit, asyncWorkResolve, asyncWorkError, asyncWorkCancel } from '../store'

function* asyncWorker(action) {

  console.log('saga action', action)

  // Needs spefici id so that cancelling is specific to this action, not all
  const { id, work, asyncRender, promises } = action.meta;

  if (!work) return;

  try {

    const { cancelled, results } = yield race({
      results: all(promises),
      cancelled: take(id)
    });

    yield cancelled 
      ? cancel() 
      : work.map((w, i) => put(asyncWorkResolve(w.key, results[i])))
    
  }

  catch(error) {
    console.log('catch error', error)
    yield put(asyncWorkError(error))
  } 

  finally {
    console.log('finally')
    if (yield cancelled()) {
      console.log('async work cancelled', work);
      for (let i =0; i < work.length; i++) {
        console.log('saga cancel action', work[i].key);
        yield put(asyncWorkCancel(work[i].key));
      }
    }
  }
}

export function* watchAsyncWork() {
  yield takeEvery(asyncDoWork, asyncWorker)
}