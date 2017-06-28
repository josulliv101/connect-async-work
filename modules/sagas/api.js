import { take, takeEvery, takeLatest, fork, cancel, call, put, cancelled, race, select } from 'redux-saga/effects'
import {isCached, fetchRequest, fetchSuccess, fetchFailure, fetchCached, fetchCancel} from '../store';

const actions = "*";
const REQUEST_TYPE_GET = 'get';

function* apiWorker(client, { meta = {} }) {
  
  const { key, endPoint, reqType = REQUEST_TYPE_GET } = meta;

  if (!endPoint) return;

  yield put(fetchRequest(key));

  try {
    
    console.log('race args', key, reqType, endPoint, client);

    const { cancelled, results } = yield race({
      results: call(client[reqType], endPoint),
      cancelled: take(fetchCancel)
    });
    
    console.log('race results', cancelled, results);
    yield cancelled ? cancel() : put(fetchSuccess(key, results));

  }

  catch(error) {
    console.log('catch error', error)
    yield put(fetchFailure(error))
  } 

  finally {
    console.log('finally')
    if (yield cancelled()) {
      console.log('fetch task cancelled', key);
    }
  }
}

export function* watchApi(apiClient) {
  yield takeEvery(actions, apiWorker, apiClient)
}
