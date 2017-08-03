'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = withAsyncWork;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _AsyncWork = require('./AsyncWork');

var _AsyncWork2 = _interopRequireDefault(_AsyncWork);

var _store = require('../redux/store');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function withAsyncWork() {
  var workItems = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];


  return function (WrappedComponent) {

    var mapStateToProps = function mapStateToProps(state, _ref) {
      var _ref$match = _ref.match,
          match = _ref$match === undefined ? { params: {} } : _ref$match;


      // The workItem keys can be <string> | <funct> - convert fns to strings here
      var keys = workItems.map(function (_ref2) {
        var key = _ref2.key;
        return _getKey(key, match);
      });

      // Map each work item's key to its work in the redux store
      var workKeys = keys.reduce(function (obj, key) {
        obj[key] = (0, _store.workState)(state)[key] || undefined;return obj;
      }, {});

      return _extends({
        keys: keys,
        loading: keys.some(function (key) {
          return (0, _store.loadState)(state)[key] && (0, _store.loadState)(state)[key].loading;
        }),
        loaded: keys.every(function (key) {
          return (0, _store.loadState)(state)[key] && (0, _store.loadState)(state)[key].loaded;
        }),
        workItems: workItems
      }, workKeys, {
        // The only way its key would exist is if it has already been initialized.
        // It could possibly already exist if loaded and cancelled, or in process of loading.
        doWorkCalled: keys.every(function (key) {
          return (0, _store.loadState)(state)[key] && ((0, _store.loadState)(state)[key].loaded || (0, _store.loadState)(state)[key].loading);
        })
      });
    };

    return (0, _reactRedux.connect)(mapStateToProps)(function (_ref3) {
      var workInitialized = _ref3.workInitialized,
          workItems = _ref3.workItems,
          props = _objectWithoutProperties(_ref3, ['workInitialized', 'workItems']);

      return _react2.default.createElement(
        _AsyncWork2.default,
        {
          dispatch: props.dispatch,
          doWorkCalled: props.doWorkCalled,
          keys: props.keys,
          loaded: props.loaded,
          loading: props.loading
          // Pass on a copy of work items where any work item <func>keys are swapped for <string>keys
          , workItems: workItems.map(function (item, i) {
            return { key: props.keys[i], work: item.work };
          }) },
        _react2.default.createElement(WrappedComponent, props)
      );
    });
  };
}

// Keys that are <func> need to be converted to <string>
function _getKey(key, match) {
  return key && typeof key === 'function' ? key(match) : key;
}