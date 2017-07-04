'use strict';

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _enzyme = require('enzyme');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _redux = require('redux');

var _reactRedux = require('react-redux');

var _reduxWatch = require('redux-watch');

var _reduxWatch2 = _interopRequireDefault(_reduxWatch);

var _middleware = require('../middleware');

var _AsyncWork = require('../components/AsyncWork');

var _AsyncWork2 = _interopRequireDefault(_AsyncWork);

var _store = require('../store');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('<AsyncWork />', function () {

  var reducers = (0, _redux.combineReducers)({ asyncWork: _store.reducer });

  describe('Store', function () {

    it('throws an error (warning) if no store is in context', function () {

      (0, _expect2.default)(function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_AsyncWork2.default, null));
      }).toThrow();
    });
  });

  describe('Render', function () {

    it('renders the wrapped component', function () {

      var store = (0, _redux.createStore)(reducers);

      var wrapper = (0, _enzyme.mount)(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store, key: 'provider' },
        _react2.default.createElement(_AsyncWork2.default, { WrappedComponent: function WrappedComponent() {
            return _react2.default.createElement(
              'div',
              null,
              'foo'
            );
          } })
      ));

      (0, _expect2.default)(wrapper.text()).toBe("foo");
    });

    it('is in loading state when first mounted', function () {

      var store = (0, _redux.createStore)(reducers);

      var wrapper = (0, _enzyme.mount)(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store, key: 'provider' },
        _react2.default.createElement(_AsyncWork2.default, { asyncWorkKey: 'foo-123', WrappedComponent: function WrappedComponent(props) {
            return _react2.default.createElement(
              'div',
              null,
              props.loading ? 'loading' : '...'
            );
          } })
      ));

      (0, _expect2.default)(wrapper.text()).toBe("loading");
    });

    it('creates prop for the specified key', function () {

      var store = (0, _redux.createStore)(reducers);

      var wrapper = (0, _enzyme.mount)(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store, key: 'provider' },
        _react2.default.createElement(_AsyncWork2.default, {
          asyncWorkKey: 'foo',
          WrappedComponent: function WrappedComponent(_ref) {
            var foo = _ref.foo;
            return _react2.default.createElement(
              'div',
              null,
              foo === null ? 'exists' : '...'
            );
          }
        })
      ));

      (0, _expect2.default)(wrapper.text()).toBe("exists");
    });

    it('populates the specified key with correct data from global state', function () {
      var _loadState, _work, _createStore;

      var id = "fooWithData";
      var store = (0, _redux.createStore)(reducers, (_createStore = {}, _createStore[_store.BASE] = { loadState: (_loadState = {}, _loadState[id] = { loading: false, loaded: true }, _loadState), work: (_work = {}, _work[id] = "foo with data", _work) }, _createStore));

      var wrapper = (0, _enzyme.mount)(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store, key: 'provider' },
        _react2.default.createElement(_AsyncWork2.default, {
          asyncWorkKey: id,
          WrappedComponent: function WrappedComponent(props) {
            return _react2.default.createElement(
              'div',
              null,
              props.fooWithData
            );
          }
        })
      ));

      (0, _expect2.default)(wrapper.text()).toBe("foo with data");
    });
  });

  describe('Actions', function () {

    it('calls INIT action on mount', function () {

      var store = (0, _redux.createStore)(reducers);
      var proto = _AsyncWork2.default.prototype;

      (0, _sinon.spy)(store, 'dispatch');
      (0, _sinon.spy)(proto, 'componentWillMount');

      var wrapper = (0, _enzyme.mount)(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store, key: 'provider' },
        _react2.default.createElement(_AsyncWork2.default, {
          asyncWorkKey: 'foo-load',
          WrappedComponent: function WrappedComponent() {
            return _react2.default.createElement('div', null);
          }
        })
      ));

      (0, _expect2.default)(store.dispatch.calledOnce).toBe(true);
      (0, _expect2.default)(store.dispatch.getCall(0).args[0]).toEqual((0, _store.asyncWorkInit)("foo-load"));
      (0, _expect2.default)(proto.componentWillMount.calledOnce).toBe(true);

      store.dispatch.restore();
      proto.componentWillMount.restore();
    });

    it('does not INIT async work if already loaded', function () {

      var store = (0, _redux.createStore)(reducers, { asyncWork: { loadState: { 'foo-do-not-load': { loading: false, loaded: true } } } });
      var proto = _AsyncWork2.default.prototype;

      (0, _sinon.spy)(store, 'dispatch');
      (0, _sinon.spy)(proto, 'componentWillMount');

      var wrapper = (0, _enzyme.mount)(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store, key: 'provider' },
        _react2.default.createElement(_AsyncWork2.default, {
          asyncWorkKey: 'foo-do-not-load',
          WrappedComponent: function WrappedComponent() {
            return _react2.default.createElement('div', null);
          }
        })
      ));

      (0, _expect2.default)(store.dispatch.called).toBe(false);
      (0, _expect2.default)(proto.componentWillMount.calledOnce).toBe(true);

      store.dispatch.restore();
      proto.componentWillMount.restore();
    });

    it('does not INIT async work if in process of loading', function () {

      var store = (0, _redux.createStore)(reducers, { asyncWork: { loadState: { 'foo-do-not-load': { loading: true, loaded: false } } } });
      var proto = _AsyncWork2.default.prototype;

      (0, _sinon.spy)(store, 'dispatch');
      (0, _sinon.spy)(proto, 'componentWillMount');

      var wrapper = (0, _enzyme.mount)(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store, key: 'provider' },
        _react2.default.createElement(_AsyncWork2.default, {
          asyncWorkKey: 'foo-do-not-load',
          WrappedComponent: function WrappedComponent() {
            return _react2.default.createElement('div', null);
          }
        })
      ));

      (0, _expect2.default)(store.dispatch.called).toBe(false);
      (0, _expect2.default)(proto.componentWillMount.calledOnce).toBe(true);

      store.dispatch.restore();
      proto.componentWillMount.restore();
    });

    it('sends work off to be started in the INIT action', function () {

      var store = (0, _redux.createStore)(reducers);
      var work = [{ foo: 'I am work' }];

      var proto = _AsyncWork2.default.prototype;

      (0, _sinon.spy)(store, 'dispatch');
      (0, _sinon.spy)(proto, 'componentWillMount');

      var wrapper = (0, _enzyme.mount)(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store, key: 'provider' },
        _react2.default.createElement(_AsyncWork2.default, {
          asyncWorkKey: 'fooWork',
          asyncWorkItems: work,
          WrappedComponent: function WrappedComponent() {
            return _react2.default.createElement('div', null);
          }
        })
      ));

      (0, _expect2.default)(store.dispatch.calledOnce).toBe(true);
      (0, _expect2.default)(store.dispatch.getCall(0).args[0]).toEqual((0, _store.asyncWorkInit)("fooWork", work));
      (0, _expect2.default)(proto.componentWillMount.calledOnce).toBe(true);

      store.dispatch.restore();
      proto.componentWillMount.restore();
    });

    it('will dispatch a CANCEL action if loading on unmount', function () {

      var store = (0, _redux.createStore)(reducers, { asyncWork: { loadState: { 'foo-cancel': { loading: true, loaded: false } } } });
      var proto = _AsyncWork2.default.prototype;

      (0, _sinon.spy)(store, 'dispatch');
      (0, _sinon.spy)(proto, 'componentWillUnmount');

      var wrapper = (0, _enzyme.mount)(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store, key: 'provider' },
        _react2.default.createElement(_AsyncWork2.default, {
          asyncWorkKey: 'foo-cancel',
          WrappedComponent: function WrappedComponent() {
            return _react2.default.createElement('div', null);
          }
        })
      ));

      wrapper.unmount();

      (0, _expect2.default)(store.dispatch.calledOnce).toBe(true);
      (0, _expect2.default)(store.dispatch.getCall(0).args[0]).toEqual((0, _store.asyncWorkCancel)("foo-cancel"));
      (0, _expect2.default)(proto.componentWillUnmount.calledOnce).toBe(true);

      store.dispatch.restore();
      proto.componentWillUnmount.restore();
    });
  });

  describe('Middleware', function () {

    it('intercepts INIT actions and processes any work', function (done) {

      var id1 = 'itemFooWork';
      var store = (0, _redux.createStore)(reducers, (0, _redux.applyMiddleware)(_middleware.asyncWork));

      // Watching the specific part of the state tree because multiple dispatches are
      // involved - so want to target only the one state change that we care about.
      var w1 = (0, _reduxWatch2.default)(store.getState, 'asyncWork.work.' + id1);
      var unsubscribe1 = store.subscribe(w1(function (newVal, oldVal, objectPath) {
        try {
          (0, _expect2.default)(store.getState().asyncWork.work[id1].foo).toBe("bar");
        } catch (e) {
          var err = e;
        } finally {
          unsubscribe1();
          err ? done(err) : done();
        }
      }));

      var wrapper = (0, _enzyme.mount)(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store, key: 'provider' },
        _react2.default.createElement(_AsyncWork2.default, {
          asyncWorkKey: 'fooWork',
          asyncWorkItems: [{ key: id1, work: function work() {
              return new Promise(function (resolve) {
                return setTimeout(function () {
                  return resolve({ foo: "bar" });
                }, 100);
              });
            } }],
          WrappedComponent: function WrappedComponent() {
            return _react2.default.createElement('div', null);
          }
        })
      ));
    });

    it('handles any errors', function (done) {

      var id1 = 'errorFooWork';
      var store = (0, _redux.createStore)(reducers, (0, _redux.applyMiddleware)(_middleware.asyncWork));

      // Watching the specific part of the state tree because multiple dispatches are
      // involved - so want to target only the one state change that we care about.
      var w1 = (0, _reduxWatch2.default)(store.getState, 'asyncWork.loadState.' + id1 + '.error');
      var unsubscribe1 = store.subscribe(w1(function (newVal, oldVal, objectPath) {
        try {
          // Map to error property so when listening for state changes, the error change is only one triggered
          (0, _expect2.default)(store.getState().asyncWork.loadState[id1].error).toBe("foobar error");
        } catch (e) {
          var err = e;
        } finally {
          unsubscribe1();
          err ? done(err) : done();
        }
      }));

      var wrapper = (0, _enzyme.mount)(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store, key: 'provider' },
        _react2.default.createElement(_AsyncWork2.default, {
          asyncWorkKey: 'fooWork',
          asyncWorkItems: [{ key: id1, work: function work() {
              return new Promise(function (resolve, reject) {
                return setTimeout(function () {
                  return reject("foobar error");
                }, 100);
              });
            } }],
          WrappedComponent: function WrappedComponent() {
            return _react2.default.createElement('div', null);
          }
        })
      ));
    });

    it('makes multiple keys availble as props when multiple work items', function (done) {

      var id1 = 'itemFooWork';
      var id2 = 'itemBazWork';
      var store = (0, _redux.createStore)(reducers, (0, _redux.applyMiddleware)(_middleware.asyncWork));

      // Watching the specific part of the state tree because multiple dispatches are
      // involved - so want to target only the one state change that we care about.
      var w1 = (0, _reduxWatch2.default)(store.getState, 'asyncWork.work.' + id1);
      var w2 = (0, _reduxWatch2.default)(store.getState, 'asyncWork.work.' + id2);
      var doneCount = 0;
      var unsubscribe1 = store.subscribe(w1(function (newVal, oldVal, objectPath) {
        try {
          (0, _expect2.default)(store.getState().asyncWork.work[id1].foo).toBe("bar");
        } catch (e) {
          var err = e;
        } finally {
          doneCount++;
          unsubscribe1();
          err ? done(err) : doneCount === 2 && done();
        }
      }));

      var unsubscribe2 = store.subscribe(w2(function (newVal, oldVal, objectPath) {
        try {
          (0, _expect2.default)(store.getState().asyncWork.work[id2].foo).toBe("baz");
        } catch (e) {
          var err = e;
        } finally {
          doneCount++;
          unsubscribe2();
          err ? done(err) : doneCount === 2 && done();
        }
      }));

      var wrapper = (0, _enzyme.mount)(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store, key: 'provider' },
        _react2.default.createElement(_AsyncWork2.default, {
          asyncWorkKey: 'fooWork',
          asyncWorkItems: [{ key: id1, work: function work() {
              return new Promise(function (resolve) {
                return setTimeout(function () {
                  return resolve({ foo: "bar" });
                }, 100);
              });
            } }, { key: id2, work: function work() {
              return new Promise(function (resolve) {
                return setTimeout(function () {
                  return resolve({ foo: "baz" });
                }, 100);
              });
            } }],
          WrappedComponent: function WrappedComponent() {
            return _react2.default.createElement('div', null);
          }
        })
      ));
    });
  });
});