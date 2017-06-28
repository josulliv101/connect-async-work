import { createAction, handleActions } from 'redux-actions';

const initialState = {
  loaded: false,
  loadState: {},
};

export const reducer = handleActions({}, initialState);
