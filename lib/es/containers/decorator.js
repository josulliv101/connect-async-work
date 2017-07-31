function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import React from 'react';
import PropTypes from 'prop-types';
import warning from 'warning';

import AsyncWork from '../components/AsyncWork';

export default function connectAsyncWork(asyncWork, mapStateToProps, mapDispatchToProps, mergeProps, options) {
  return function (WrappedComponent) {
    return function (_ref) {
      var action = _ref.action,
          key = _ref.key,
          loading = _ref.loading,
          props = _objectWithoutProperties(_ref, ['action', 'key', 'loading']);

      var asyncWorkProps = { action: action, key: key, loading: loading };
      return React.createElement(
        AsyncWork,
        asyncWorkProps,
        React.createElement(WrappedComponent, props)
      );
    };
  };
}