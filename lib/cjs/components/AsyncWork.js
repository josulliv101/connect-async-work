'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _store = require('../redux/store');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AsyncWork = function (_React$Component) {
  _inherits(AsyncWork, _React$Component);

  function AsyncWork(props, context) {
    _classCallCheck(this, AsyncWork);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props, context));

    var dispatch = props.dispatch,
        doWorkCalled = props.doWorkCalled,
        workItems = props.workItems,
        rootCmp = props.rootCmp;


    var promises = void 0;

    // This info maps to redux store
    if (doWorkCalled === true) return _possibleConstructorReturn(_this);

    promises = workItems.map(function (item) {
      return item.work();
    });

    _this.action = (0, _store.asyncDoWork)(workItems, promises, false);
    _this.workPromises = _this.action.meta.promises;
    dispatch(_this.action);
    _this.cancelDoWork = _this.action.meta.cancel;
    return _this;
  }

  AsyncWork.prototype.componentWillUnmount = function componentWillUnmount() {
    var _props = this.props,
        dispatch = _props.dispatch,
        loaded = _props.loaded;

    // No need to cancel if everything is loaded.

    if (loaded === true) return;

    if (this.cancelDoWork) {
      dispatch(this.cancelDoWork());
    }
  };

  AsyncWork.prototype.render = function render() {
    var children = this.props.children;

    return children ? _react2.default.Children.only(children) : null;
  };

  return AsyncWork;
}(_react2.default.Component);

AsyncWork.propTypes = {
  children: _propTypes2.default.node,
  doWorkCalled: _propTypes2.default.bool,
  keys: _propTypes2.default.arrayOf(_propTypes2.default.string),
  loading: _propTypes2.default.bool, // True if any async work is unresolved for each component
  workItems: _propTypes2.default.arrayOf(_propTypes2.default.object)
};
AsyncWork.defaultProps = {
  workItems: []
};
exports.default = AsyncWork;