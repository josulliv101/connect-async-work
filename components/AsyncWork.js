'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.withAsyncWork = withAsyncWork;

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

function withAsyncWork(asyncWorkKey) {
  var asyncWorkItems = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];


  return function (WrappedComponent) {
    var _class, _temp;

    return _temp = _class = function (_React$Component) {
      _inherits(withAsyncWork, _React$Component);

      function withAsyncWork() {
        _classCallCheck(this, withAsyncWork);

        return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
      }

      withAsyncWork.prototype.render = function render() {

        var asyncWorkKeys2 = asyncWorkItems.map(function (item) {
          return item.key;
        });

        var addedProps = {
          asyncWorkItems: asyncWorkItems,
          asyncWorkKey: asyncWorkKey,
          asyncWorkKeys: asyncWorkKeys2,
          WrappedComponent: WrappedComponent
        };
        return _react2.default.createElement(AsyncWork, _extends({}, this.props, addedProps));
      };

      return withAsyncWork;
    }(_react2.default.Component), _class.asyncWork = true, _class.asyncWorkDone = false, _class.asyncWorkKey = asyncWorkKey, _class.asyncWorkKeys = asyncWorkItems, _temp;
  };
}

var AsyncWork = function (_React$Component2) {
  _inherits(AsyncWork, _React$Component2);

  function AsyncWork(props, context) {
    _classCallCheck(this, AsyncWork);

    var _this2 = _possibleConstructorReturn(this, _React$Component2.call(this, props));

    _this2.getAsyncWorkKey = function (key) {
      var match = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _this2.props.match;
      return typeof key === 'function' ? key(match) : key;
    };

    _this2.isLoading = function (key) {
      return (0, _store.isLoading)(_this2.getState(), key);
    };

    _this2.isLoaded = function (key) {
      return (0, _store.isLoaded)(_this2.getState(), key);
    };

    _this2.getState = function () {
      return _this2.context.store.getState();
    };

    (0, _invariant2.default)(context.store, 'A store needs to be included in the AsyncWork component\'s context.');

    _this2.key = _this2.getAsyncWorkKey(_this2.props.asyncWorkKey);

    return _this2;
  }

  AsyncWork.prototype.componentWillMount = function componentWillMount() {
    var work = this.props.asyncWorkItems,
        key = this.key,
        store = this.context.store;


    for (var i = 0; i < work.length; i++) {
      var _key = work[i].key;
      if (_key && !this.isLoaded(_key) && !this.isLoading(_key)) {
        store.dispatch((0, _store.asyncWorkInit)(_key, work));
      }
    }
  };

  AsyncWork.prototype.componentWillUnmount = function componentWillUnmount() {
    var work = this.props.asyncWorkItems,
        key = this.key,
        store = this.context.store;

    for (var i = 0; i < work.length; i++) {
      var _key2 = work[i].key;
      if (this.isLoading(_key2)) {
        store.dispatch((0, _store.asyncWorkCancel)(_key2));
      }
    }
  };

  AsyncWork.prototype.render = function render() {
    var _addedProps;

    var key = this.key,
        _props = this.props,
        children = _props.children,
        WrappedComponent = _props.WrappedComponent,
        props = _objectWithoutProperties(_props, ['children', 'WrappedComponent']);

    var addedProps = (_addedProps = {
      asyncWorkKey: key
    }, _addedProps[key] = this.getWorkFromState(key), _addedProps.loading = this.isLoading(key), _addedProps);

    if (!WrappedComponent) return null;

    return _react2.default.createElement(WrappedComponent, _extends({}, props, addedProps));
  };

  //// Helpers //// 

  AsyncWork.prototype.getWorkFromState = function getWorkFromState(key) {
    var globalState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.getState();

    if (!key) return null;
    return this.isLoaded(key) ? globalState[_store.BASE].work && globalState[_store.BASE].work[key] : null;
  };

  return AsyncWork;
}(_react2.default.Component);

AsyncWork.propTypes = {
  action: _propTypes2.default.object,
  asyncWorkItems: _propTypes2.default.arrayOf(_propTypes2.default.object),
  asyncWorkKey: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.func] // Incorporate a param id into the key
  ),
  asyncWorkKeys: _propTypes2.default.arrayOf(_propTypes2.default.string),
  children: _propTypes2.default.node,
  loading: _propTypes2.default.bool, // True if all aync work is done
  match: _propTypes2.default.object // Most likely provided by a Route
};
AsyncWork.contextTypes = { store: _propTypes2.default.object };
AsyncWork.defaultProps = {
  asyncWorkItems: [],
  match: { params: {} }
};
exports.default = AsyncWork;