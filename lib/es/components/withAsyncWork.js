var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import React from 'react';
import { connect } from 'react-redux';

import AsyncWork from './AsyncWork';
import { workState, loadState } from '../store';

export default function withAsyncWork() {
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
        obj[key] = workState(state)[key] || undefined;return obj;
      }, {});

      return _extends({
        keys: keys,
        loading: keys.some(function (key) {
          return loadState(state)[key] && loadState(state)[key].loading;
        }),
        loaded: keys.every(function (key) {
          return loadState(state)[key] && loadState(state)[key].loaded;
        }),
        workItems: workItems
      }, workKeys, {
        // The only way its key would exist is if it has already been initialized.
        // It could possibly already exist if loaded and cancelled, or in process of loading.
        doWorkCalled: keys.every(function (key) {
          return loadState(state)[key] && (loadState(state)[key].loaded || loadState(state)[key].loading);
        })
      });
    };

    return connect(mapStateToProps)(function (_ref3) {
      var workInitialized = _ref3.workInitialized,
          workItems = _ref3.workItems,
          props = _objectWithoutProperties(_ref3, ['workInitialized', 'workItems']);

      return React.createElement(
        AsyncWork,
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
        React.createElement(WrappedComponent, props)
      );
    });
  };
}

function _getKey(key, match) {
  return key && typeof key === 'function' ? key(match) : key;
}