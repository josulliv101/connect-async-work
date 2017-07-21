import { all } from 'redux-saga/effects';
import { watchAsyncWork } from '@josulliv101/connect-async-work';

export default function* root() {
  yield all([
  	watchAsyncWork(),
  ]);
}