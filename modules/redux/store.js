import uuidv4 from 'uuid/v4'
import { createAction, handleActions } from 'redux-actions';

function noop() {}

// Middleware handles how work should translate into actions that update the store
export const asyncDoWork = createAction('@async-work/DO_WORK', key => ({ key }), (work = [], promises = [], asyncRender = false, callback = noop, id = uuidv4()) => ({ id, promises, work, asyncRender, callback, cancel: () => ({ type: id, meta: { promises } }) }));
export const asyncWorkInit = createAction('@async-work/INIT', key => ({ key }), (key, work = []) => ({ key, work }));
export const asyncWorkResolve = createAction('@async-work/RESOLVE', (key, data) => ({ key, data }), (key) => ({ key }));
export const asyncWorkCancel = createAction('@async-work/CANCEL', key => ({ key }));
export const asyncWorkError = createAction('@async-work/ERROR', (key, error) => ({ key, error }));
export const asyncWorkClear = createAction('@async-work/CLEAR');

export const BASE = "asyncWork";
export const WORK = "work";
export const LOADSTATE = "loadState";

export const paths = {
  BASE: "asyncWork",
  WORK: "work",
  LOADSTATE: "loadState",
}

const { BASE: BASE2, WORK: WORK2, LOADSTATE: LOADSTATE2 } = paths;

const initialState = {
  [WORK2]: {},
  [LOADSTATE2]: {},
}

export const isLoaded = (globalState, key) => 
              globalState[BASE2][LOADSTATE2][key] && globalState[BASE2][LOADSTATE2][key].loaded;

export const isLoading = (globalState, key) => 
              globalState[BASE2][LOADSTATE2][key] && globalState[BASE2][LOADSTATE2][key].loading;

export const anyLoading = (globalState) => Object.values(globalState[BASE2][LOADSTATE2]).some(item => item.loading)

export function loadState(globalState) {
  return globalState.asyncwork.loadState;
}

export function workState(globalState) {
  return globalState.asyncwork.work;
}

export const reducer = handleActions({

  [asyncDoWork]: (state, {meta: { work }}) => ({
    ...state,
    loadState: {
      ...state.loadState,
      ...(work.reduce((o, item) => (o[item.key] = {loading: true, loaded: false}) && o, {})),
    },
  }),
/*  [asyncWorkInit]: (state, {payload: { key }}) => ({
    ...state,
    loadState: {
      ...state.loadState,
      [key]: {
        loading: true,
        loaded: false,
      },
    },
  }),*/
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
