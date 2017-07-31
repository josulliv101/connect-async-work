'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _store = require('../store');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AsyncWork = function (_React$Component) {
  _inherits(AsyncWork, _React$Component);

  function AsyncWork(props, context) {
    _classCallCheck(this, AsyncWork);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props, context));

    console.log('AsyncWork / constructor');
    var dispatch = props.dispatch,
        doWorkCalled = props.doWorkCalled,
        workItems = props.workItems,
        rootCmp = props.rootCmp;
    var asyncRender = context.asyncRender;

    var promises = void 0;

    // This info maps to redux store
    if (doWorkCalled === true) return _possibleConstructorReturn(_this);

    promises = workItems.map(function (item) {
      return item.work();
    });

    _this.action = (0, _store.asyncDoWork)(workItems, promises, asyncRender);
    _this.workPromises = _this.action.meta.promises;

    console.log('AsyncWork / constructor / DISPATCH ACTION');
    // Can return promise here from dispatch via middleware
    // if (asyncRender !== true) {
    dispatch(_this.action);
    _this.cancelDoWork = _this.action.meta.cancel;
    // }
    return _this;
  }

  AsyncWork.prototype.componentWillUnmount = function componentWillUnmount() {
    var _props = this.props,
        dispatch = _props.dispatch,
        loaded = _props.loaded;


    console.log('AsyncWork componentWillUnmount - all loaded %s', loaded);

    // No need to cancel if everything is loaded.
    if (loaded === true) return;

    if (this.cancelDoWork) {
      dispatch(this.cancelDoWork());
    }
  };

  AsyncWork.prototype.render = function render() {
    console.log('AsyncWork / render', this.context.asyncRender);
    // The propsToPass will contain the appropriate key for each item of
    // work... provided by the HOC which connects to the store

    var _props2 = this.props,
        children = _props2.children,
        workItems = _props2.workItems,
        propsToPass = _objectWithoutProperties(_props2, ['children', 'workItems']);

    // The child is the wrapped component - already with neeeded props via HOC


    var ChildComponent = children ? _react2.default.Children.only(children) : null;

    // The `is` prop avoids a warning about needing lowercase elements.
    var elementProps = { is: 'AsyncWork', promise: this.workPromises };

    // Wrap the ChildComponent in an AsyncWork tag when doing async render.
    // This gives the renderer access to the promise object on the instance.
    // Without this custom element, renderer converts all to html tags 
    // which cannot have a custom props like a promise.
    // Better way to accomplish this?
    // console.log('ChildComponent', ChildComponent)
    if (this.context.asyncRender) {
      return _react2.default.createElement('AsyncWork', elementProps, [ChildComponent]);
    }
    return ChildComponent;
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
AsyncWork.contextTypes = {
  asyncRender: _propTypes2.default.bool
};
AsyncWork.defaultProps = {
  workItems: []
};
exports.default = AsyncWork;