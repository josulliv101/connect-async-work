'use strict';

exports.__esModule = true;
exports.default = connectAsyncWork;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _AsyncWork = require('../components/AsyncWork');

var _AsyncWork2 = _interopRequireDefault(_AsyncWork);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function connectAsyncWork(asyncWork, mapStateToProps, mapDispatchToProps, mergeProps, options) {
  return function (WrappedComponent) {
    return function (_ref) {
      var action = _ref.action,
          key = _ref.key,
          loading = _ref.loading,
          props = _objectWithoutProperties(_ref, ['action', 'key', 'loading']);

      var asyncWorkProps = { action: action, key: key, loading: loading };
      return _react2.default.createElement(
        _AsyncWork2.default,
        asyncWorkProps,
        _react2.default.createElement(WrappedComponent, props)
      );
    };
  };
}