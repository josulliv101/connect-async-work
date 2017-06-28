import { createAction, handleActions } from 'redux-actions';

export const fetchRequest = createAction('@connect-async-work/FETCH_REQUEST', key => ({ key }), (key) => ({ key }));
export const fetchSuccess = createAction('@connect-async-work/FETCH_SUCCEESS', (key, data) => ({ key, data }));
export const fetchFailure = createAction('@connect-async-work/FETCH_FAILURE', (key, error) => ({ key, error }));
export const fetchCancel = createAction('@connect-async-work/FETCH_CANCEL', key => ({ key }));
export const fetchCached = createAction('@connect-async-work/FETCH_CACHED');

const initialState = {
  data: {},
  loadState: {},
};

const reducer = handleActions({

  [fetchRequest]: (state, {payload: { key }}) => ({
    ...state,
    loadState: {
      ...state.loadState,
      [key]: {
        loading: true,
        loaded: false,
      },
    },
  }),
  [fetchSuccess]: (state, {payload: { key, data }}) => ({
    ...state,
    loadState: {
      ...state.loadState,
      [key]: {
        loading: false,
        loaded: true,
        error: null,
      },
    },
    [key]: data,
  }),
  [fetchFailure]: (state, {payload}) => ({
    ...state,
    error: payload,
    loading: false,
    loaded: false,
  }),
  [fetchCancel]: (state, {payload: { key }}) => ({
    ...state,
    loadState: {
      ...state.loadState,
      [key]: {
        loading: false,
        loaded: false,
      },
    },
  }),

}, initialState);

export default reducer;

export const isCached = (globalState, key) => globalState.api.loadState[key];
