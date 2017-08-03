'use strict';

exports.__esModule = true;
exports.reducer = exports.anyLoading = exports.isLoading = exports.isLoaded = exports.paths = exports.LOADSTATE = exports.WORK = exports.BASE = exports.asyncWorkClear = exports.asyncWorkError = exports.asyncWorkCancel = exports.asyncWorkResolve = exports.asyncDoWork = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _initialState, _handleActions;

exports.loadState = loadState;
exports.workState = workState;

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

var _reduxActions = require('redux-actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function noop() {}

// Middleware handles how work should translate into actions that update the store
var asyncDoWork = exports.asyncDoWork = (0, _reduxActions.createAction)('@async-work/DO_WORK', function (key) {
  return { key: key };
}, function () {
  var work = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var promises = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var asyncRender = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : noop;
  var id = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : (0, _v2.default)();
  return { id: id, promises: promises, work: work, asyncRender: asyncRender, callback: callback, cancel: function cancel() {
      return { type: id, meta: { promises: promises } };
    } };
});
var asyncWorkResolve = exports.asyncWorkResolve = (0, _reduxActions.createAction)('@async-work/RESOLVE', function (key, data) {
  return { key: key, data: data };
}, function (key) {
  return { key: key };
});
var asyncWorkCancel = exports.asyncWorkCancel = (0, _reduxActions.createAction)('@async-work/CANCEL', function (key) {
  return { key: key };
});
var asyncWorkError = exports.asyncWorkError = (0, _reduxActions.createAction)('@async-work/ERROR', function (key, error) {
  return { key: key, error: error };
});
var asyncWorkClear = exports.asyncWorkClear = (0, _reduxActions.createAction)('@async-work/CLEAR');

var BASE = exports.BASE = "asyncWork";
var WORK = exports.WORK = "work";
var LOADSTATE = exports.LOADSTATE = "loadState";

var paths = exports.paths = {
  BASE: "asyncWork",
  WORK: "work",
  LOADSTATE: "loadState"
};

var BASE2 = paths.BASE,
    WORK2 = paths.WORK,
    LOADSTATE2 = paths.LOADSTATE;


var initialState = (_initialState = {}, _initialState[WORK2] = {}, _initialState[LOADSTATE2] = {}, _initialState);

var isLoaded = exports.isLoaded = function isLoaded(globalState, key) {
  return globalState[BASE2][LOADSTATE2][key] && globalState[BASE2][LOADSTATE2][key].loaded;
};

var isLoading = exports.isLoading = function isLoading(globalState, key) {
  return globalState[BASE2][LOADSTATE2][key] && globalState[BASE2][LOADSTATE2][key].loading;
};

var anyLoading = exports.anyLoading = function anyLoading(globalState) {
  return Object.values(globalState[BASE2][LOADSTATE2]).some(function (item) {
    return item.loading;
  });
};

function loadState(globalState) {
  return globalState.asyncwork.loadState;
}

function workState(globalState) {
  return globalState.asyncwork.work;
}

var reducer = exports.reducer = (0, _reduxActions.handleActions)((_handleActions = {}, _handleActions[asyncDoWork] = function (state, _ref) {
  var work = _ref.meta.work;
  return _extends({}, state, {
    loadState: _extends({}, state.loadState, work.reduce(function (o, item) {
      return (o[item.key] = { loading: true, loaded: false }) && o;
    }, {}))
  });
}, _handleActions[asyncWorkResolve] = function (state, _ref2) {
  var _extends2, _extends3;

  var _ref2$payload = _ref2.payload,
      key = _ref2$payload.key,
      data = _ref2$payload.data;
  return _extends({}, state, {
    loadState: _extends({}, state.loadState, (_extends2 = {}, _extends2[key] = {
      loading: false,
      loaded: true,
      error: null
    }, _extends2)),
    work: _extends({}, state.work, (_extends3 = {}, _extends3[key] = data, _extends3))
  });
}, _handleActions[asyncWorkError] = function (state, _ref3) {
  var _extends4;

  var _ref3$payload = _ref3.payload,
      key = _ref3$payload.key,
      error = _ref3$payload.error;
  return _extends({}, state, {
    loadState: _extends({}, state.loadState, (_extends4 = {}, _extends4[key] = {
      loading: false,
      loaded: false,
      error: error
    }, _extends4))
  });
}, _handleActions[asyncWorkCancel] = function (state, _ref4) {
  var _extends5;

  var key = _ref4.payload.key;
  return _extends({}, state, {
    loadState: _extends({}, state.loadState, (_extends5 = {}, _extends5[key] = {
      loading: false,
      loaded: false,
      canceled: true
    }, _extends5))
  });
}, _handleActions[asyncWorkClear] = function (state) {
  return {
    initialState: initialState
  };
}, _handleActions), initialState);