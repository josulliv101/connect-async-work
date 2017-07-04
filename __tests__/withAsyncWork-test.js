'use strict';

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _enzyme = require('enzyme');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _redux = require('redux');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _AsyncWork = require('../components/AsyncWork');

var _AsyncWork2 = _interopRequireDefault(_AsyncWork);

var _store = require('../store');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('withAsyncWork HOC', function () {

  var reducers = (0, _redux.combineReducers)({ asyncWork: _store.reducer });
  var context = {
    context: {
      store: (0, _redux.createStore)(reducers)
    },
    childContextTypes: { store: _propTypes2.default.object }
  };

  describe('Initialization', function () {

    it('adds a key as a \'asyncWorkKey\' static variable', function () {

      var EnhancedComponent = (0, _AsyncWork.withAsyncWork)("keyFoo")(function () {
        return _react2.default.createElement('div', null);
      });
      (0, _expect2.default)(EnhancedComponent.asyncWorkKey).toBe("keyFoo");
    });

    it('adds an \'asyncWorkItems\' array as a static variable', function () {

      var work = [{ key: "foo1" }, { key: "foo2" }];
      var EnhancedComponent = (0, _AsyncWork.withAsyncWork)("keyFoo", work)(function () {
        return _react2.default.createElement('div', null);
      });
      (0, _expect2.default)(EnhancedComponent.asyncWorkKeys[0].key).toBe("foo1");
      (0, _expect2.default)(EnhancedComponent.asyncWorkKeys[1].key).toBe("foo2");
    });

    it('passes the asyncWorkKey as a prop down to Wrapped Component', function () {

      var EnhancedComponent = (0, _AsyncWork.withAsyncWork)("foo-AsyncKey")(function (props) {
        return _react2.default.createElement(
          'div',
          null,
          props.asyncWorkKey
        );
      });
      var wrapper = (0, _enzyme.mount)(_react2.default.createElement(EnhancedComponent, null), context);

      (0, _expect2.default)(wrapper.text()).toBe("foo-AsyncKey");
    });

    it('can set the asyncWorkKey with a passed-in function', function () {

      var EnhancedComponent = (0, _AsyncWork.withAsyncWork)(function () {
        return "foo-AsyncKey";
      })(function (props) {
        return _react2.default.createElement(
          'div',
          null,
          props.asyncWorkKey
        );
      });
      var wrapper = (0, _enzyme.mount)(_react2.default.createElement(EnhancedComponent, null), context);

      (0, _expect2.default)(wrapper.text()).toBe("foo-AsyncKey");
    });

    it('can set an asyncWorkKey based on current match/location params', function () {

      // The match param is usually supplied as a prop by the Route, in this case we'll add it as custom prop
      var EnhancedComponent = (0, _AsyncWork.withAsyncWork)(function (match) {
        return 'foo-AsyncKey-' + match.params.id;
      })(function (props) {
        return _react2.default.createElement(
          'div',
          null,
          props.asyncWorkKey
        );
      });
      var wrapper = (0, _enzyme.mount)(_react2.default.createElement(EnhancedComponent, { match: { params: { id: 123 } } }), context);

      (0, _expect2.default)(wrapper.text()).toBe("foo-AsyncKey-123");
    });

    it('has custom props passed down to Wrapped Component', function () {

      var EnhancedComponent = (0, _AsyncWork.withAsyncWork)("fooAsyncKey")(function (props) {
        return _react2.default.createElement(
          'div',
          null,
          props.foo
        );
      });
      var wrapper = (0, _enzyme.mount)(_react2.default.createElement(EnhancedComponent, { foo: 'bar' }), context);

      (0, _expect2.default)(wrapper.text()).toBe("bar");
    });
  });
});