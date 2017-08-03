import uuidv4 from 'uuid/v4'
import { createAction, handleActions } from 'redux-actions';

function noop() {}

// Middleware handles how work should translate into actions that update the store
export const asyncDoWork = createAction('@async-work/DO_WORK', key => ({ key }), (work = [], promises = [], asyncRender = false, callback = noop, id = uuidv4()) => ({ id, promises, work, asyncRender, callback, cancel: () => ({ type: id, meta: { promises } }) }));
export const asyncWorkResolve = createAction('@async-work/RESOLVE', (key, data) => ({ key, data }), (key) => ({ key }));
export const asyncWorkCancel = createAction('@async-work/CANCEL', key => ({ key }));
export const asyncWorkError = createAction('@async-work/ERROR', (key, error) => ({ key, error }));
export const asyncWorkClear = createAction('@async-work/CLEAR');

export const BASE = "asyncWork"
export const WORK = "work"
export const LOADSTATE = "loadState"

const initialState = {
  [WORK]: {},
  [LOADSTATE]: {},
}

export function loadState(globalState = {}) {
  return globalState.asyncwork && globalState.asyncwork.loadState;
}

export function workState(globalState = {}) {
  return globalState.asyncwork && globalState.asyncwork.work;
}

export function isLoading(globalState = {}) {
  const loadState = globalState.asyncwork && globalState.asyncwork.loadState
  return Object.keys(loadState).some(key => loadState[key] && loadState[key].loading)
}

export const reducer = handleActions({

  [asyncDoWork]: (state, {meta: { work }}) => ({
    ...state,
    loadState: {
      ...state.loadState,
      ...(work.reduce((o, item) => (o[item.key] = {loading: true, loaded: false}) && o, {})),
    },
  }),
  [asyncWorkResolve]: (state, {payload: { key, data }}) => ({
    ...state,
    loadState: {
      ...state.loadState,
      [key]: {
        loading: false,
        loaded: true,
        error: null,
      },
    },
    work: {
      ...state.work,
      [key]: data,
    },
  }),
  [asyncWorkError]: (state, {payload: { key, error }}) => ({
    ...state,
    loadState: {
      ...state.loadState,
      [key]: {
        loading: false,
        loaded: false,
        error,
      },
    },
  }),
  [asyncWorkCancel]: (state, {payload: { key }}) => ({
    ...state,
    loadState: {
      ...state.loadState,
      [key]: {
        loading: false,
        loaded: false,
        canceled: true,
      },
    },
  }),

  [asyncWorkClear]: (state) => ({
    initialState
  }),

}, initialState);

