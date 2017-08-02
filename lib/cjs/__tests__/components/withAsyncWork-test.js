'use strict';

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _enzyme = require('enzyme');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _AsyncWork = require('../../components/AsyncWork');

var _AsyncWork2 = _interopRequireDefault(_AsyncWork);

var _withAsyncWork = require('../../components/withAsyncWork');

var _withAsyncWork2 = _interopRequireDefault(_withAsyncWork);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('withAsyncWork HOC', function () {

  var context = {
    store: {
      getState: function getState() {
        return {
          asyncwork: {
            work: {
              foo: 'foo data',
              bar: null,
              foo123: 'foo123 created by fn'
            },
            loadState: {
              foo: {
                loaded: true,
                loading: false
              }
            }
          }
        };
      },
      dispatch: function dispatch(noop) {
        return noop;
      },
      subscribe: function subscribe(noop) {
        return noop;
      }
    }
  };

  var work = function work() {
    return Promise.resolve('done');
  };
  var workResolved = [{ key: 'foo', work: work }];
  var workResolvedFnKey = [{ key: function key(match) {
      return 'foo' + match.params.id;
    }, work: work }];
  var workUninitialized = [{ key: 'bar', work: work }];
  var workMulti = [{ key: 'foo', work: work }, { key: 'bar', work: work }, { key: 'baz', work: work }];

  describe('Props', function () {

    it('passes the work keys on to <Enhanced/>', function () {
      var FooCmp = function FooCmp(_ref) {
        var keys = _ref.keys;
        return _react2.default.createElement(
          'div',
          null,
          keys[0] + ' / length of ' + keys.length
        );
      };
      var Enhanced = (0, _withAsyncWork2.default)(workResolved)(FooCmp);
      var wrapper = (0, _enzyme.mount)(_react2.default.createElement(Enhanced, null), { context: context });
      (0, _expect2.default)(wrapper.text()).toBe('foo / length of 1');
    });

    it('respects the order of work keys passed on to wrapped cmp', function () {

      // For example, the second work item will always match the second key in the prop's array of keys 

      var Enhanced = (0, _withAsyncWork2.default)(workMulti)(MockWrappedCmp);
      var wrapper = (0, _enzyme.mount)(_react2.default.createElement(Enhanced, null), { context: context });

      (0, _expect2.default)(wrapper.text()).toBe('foo, bar, baz');

      function MockWrappedCmp(_ref2) {
        var _ref2$keys = _ref2.keys,
            first = _ref2$keys[0],
            second = _ref2$keys[1],
            third = _ref2$keys[2];

        return _react2.default.createElement(
          'div',
          null,
          first + ', ' + second + ', ' + third
        );
      }
    });

    it('indicates that work has not been requested', function () {

      var Enhanced = (0, _withAsyncWork2.default)(workUninitialized)(function (props) {
        return _react2.default.createElement('div', null);
      });
      var wrapper = (0, _enzyme.mount)(_react2.default.createElement(Enhanced, null), { context: context });
      var props = wrapper.find(_AsyncWork2.default).props();
      (0, _expect2.default)(props.doWorkCalled).toBe(false);
    });

    it('indicates that work has been requested', function () {

      var Enhanced = (0, _withAsyncWork2.default)(workResolved)(function (props) {
        return _react2.default.createElement('div', null);
      });
      var wrapper = (0, _enzyme.mount)(_react2.default.createElement(Enhanced, null), { context: context });
      var props = wrapper.find(_AsyncWork2.default).props();
      (0, _expect2.default)(props.doWorkCalled).toBe(true);
    });

    it('passes the work items <string>keys as props to <Enhanced />', function () {

      var Enhanced = (0, _withAsyncWork2.default)(workResolved)(function (props) {
        return _react2.default.createElement(
          'div',
          null,
          props.foo
        );
      });
      var wrapper = (0, _enzyme.mount)(_react2.default.createElement(Enhanced, null), { context: context });
      (0, _expect2.default)(wrapper.text()).toBe('foo data');
    });

    it('passes the work items <function>keys as props to <Enhanced />', function () {

      var Enhanced = (0, _withAsyncWork2.default)(workResolvedFnKey)(function (props) {
        return _react2.default.createElement(
          'div',
          null,
          props.foo123
        );
      });
      var wrapper = (0, _enzyme.mount)(
      // A Route will typically be responsible for including `match` in the props
      _react2.default.createElement(Enhanced, { match: { params: { id: 123 } } }), { context: context });
      (0, _expect2.default)(wrapper.text()).toBe('foo123 created by fn');
    });
  });

  describe('Render', function () {

    it('has custom props passed down to Wrapped Component', function () {

      var Enhanced = (0, _withAsyncWork2.default)([])(function (props) {
        return _react2.default.createElement(
          'div',
          null,
          props.customProp
        );
      });
      var wrapper = (0, _enzyme.mount)(_react2.default.createElement(Enhanced, { customProp: 'bar' }), { context: context });

      (0, _expect2.default)(wrapper.text()).toBe("bar");
    });
  });
});