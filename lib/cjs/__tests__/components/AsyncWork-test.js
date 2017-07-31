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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('<AsyncWork />', function () {

  // const reducers = combineReducers({ asyncWork: reducer })
  var context = {
    asyncRender: true
  };

  describe('Life cycle hooks', function () {

    beforeEach(function () {});

    afterEach(function () {});

    describe('Constructor', function () {

      it('adds <Array>promises of work to the instance', function () {
        var workItems = [{ key: 'foo', work: function work() {
            return Promise.resolve();
          } }];

        var _mount = (0, _enzyme.mount)(_react2.default.createElement(_AsyncWork2.default, { workItems: workItems, dispatch: function dispatch(noop) {
            return noop;
          } })),
            node = _mount.node;

        (0, _expect2.default)(Array.isArray(node.workPromises)).toBe(true);
        (0, _expect2.default)(node.workPromises.length).toBe(1);
        (0, _expect2.default)(node.workPromises[0] instanceof Promise).toBe(true);
      });
    });
  });

  describe('Render', function () {

    it('throws an error if multiple children found', function () {
      (0, _expect2.default)(function () {
        (0, _enzyme.mount)(_react2.default.createElement(
          _AsyncWork2.default,
          { dispatch: function dispatch(noop) {
              return noop;
            } },
          _react2.default.createElement('div', null),
          _react2.default.createElement('div', null)
        ));
      }).toThrow();
    });

    it('wraps the rendered elements with a AsyncWork tag when asyncRender context is true', function () {
      var wrapper = (0, _enzyme.mount)(_react2.default.createElement(
        _AsyncWork2.default,
        { dispatch: function dispatch(noop) {
            return noop;
          } },
        _react2.default.createElement('div', null)
      ));
      var wrapperAsyncRender = (0, _enzyme.mount)(_react2.default.createElement(
        _AsyncWork2.default,
        { dispatch: function dispatch(noop) {
            return noop;
          } },
        _react2.default.createElement('div', null)
      ), { context: context });
      (0, _expect2.default)(wrapper.html()).toBe('<div></div>');
      (0, _expect2.default)(wrapperAsyncRender.html()).toMatch(/^<AsyncWork/i);
    });
  });

  describe('Actions', function () {

    it('dispatches WORK DO action when doWorkCalled is false (the default)', function () {
      var spy = _sinon2.default.spy();
      var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_AsyncWork2.default, { dispatch: spy }));
      (0, _expect2.default)(spy.calledOnce).toBe(true);
    });

    it('does not dispatch WORK DO action when work already requested', function () {
      var spy = _sinon2.default.spy();
      var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_AsyncWork2.default, { doWorkCalled: true, dispatch: spy }));
      (0, _expect2.default)(spy.notCalled).toBe(true);
    });

    it('creates a uid for each WORK DO action', function () {
      var spy = _sinon2.default.spy();
      var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_AsyncWork2.default, { dispatch: spy }));
      (0, _expect2.default)(spy.getCall(0).args[0].type).toBe('@async-work/DO_WORK');
      (0, _expect2.default)(spy.getCall(0).args[0].meta.id).toExist();
    });

    it('will dispatch a WORK CANCEL action (id created from "do work" action) if loading on unmount', function () {

      var spy = _sinon2.default.spy();
      var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_AsyncWork2.default, { dispatch: spy }));

      wrapper.unmount();

      var id = spy.getCall(0).args[0].meta.id;
      var idDispatched = spy.getCall(1).args[0].type;

      (0, _expect2.default)(spy.calledTwice).toBe(true);
      (0, _expect2.default)(idDispatched).toEqual(id);
    });
  });
  /*
    describe('Middleware', () => {
  
      it('intercepts INIT actions and processes any work', (done) => {
        
        const id1 = 'itemFooWork'
        const store = createStore(reducers, applyMiddleware(asyncWork))
  
        // Watching the specific part of the state tree because multiple dispatches are
        // involved - so want to target only the one state change that we care about.
        let w1 = watch(store.getState, `asyncWork.work.${id1}`)
        let unsubscribe1 = store.subscribe(w1((newVal, oldVal, objectPath) => {
          try {
            expect(store.getState().asyncWork.work[id1].foo).toBe("bar")
          } catch (e) {
            var err = e
          } finally {
            unsubscribe1()
            err ? done(err) : done()
          }
        }))
  
        const wrapper = mount(
          <Provider store={store} key="provider">
            <AsyncWork 
              asyncWorkKey="fooWork" 
              asyncWorkItems={ [
                { key: id1, work: () => new Promise((resolve) => setTimeout(() => resolve({ foo: "bar" }), 100)) }
              ] }
              WrappedComponent={() => <div />} 
            />
          </Provider>
        );
      })
  
      it('handles any errors', (done) => {
        
        const id1 = 'errorFooWork'
        const store = createStore(reducers, applyMiddleware(asyncWork))
  
        // Watching the specific part of the state tree because multiple dispatches are
        // involved - so want to target only the one state change that we care about.
        let w1 = watch(store.getState, `asyncWork.loadState.${id1}.error`)
        let unsubscribe1 = store.subscribe(w1((newVal, oldVal, objectPath) => {
          try {
            // Map to error property so when listening for state changes, the error change is only one triggered
            expect(store.getState().asyncWork.loadState[id1].error).toBe("foobar error")
          } catch (e) {
            var err = e
          } finally {
            unsubscribe1()
            err ? done(err) : done()
          }
        }))
  
        const wrapper = mount(
          <Provider store={store} key="provider">
            <AsyncWork 
              asyncWorkKey="fooWork" 
              asyncWorkItems={ [
                { key: id1, work: () => new Promise((resolve, reject) => setTimeout(() => reject("foobar error"), 100)) }
              ] }
              WrappedComponent={() => <div />} 
            />
          </Provider>
        );
      })
  
  
      it('makes multiple keys availble as props when multiple work items', (done) => {
        
        const id1 = 'itemFooWork'
        const id2 = 'itemBazWork'
        const store = createStore(reducers, applyMiddleware(asyncWork))
  
        // Watching the specific part of the state tree because multiple dispatches are
        // involved - so want to target only the one state change that we care about.
        let w1 = watch(store.getState, `asyncWork.work.${id1}`)
        let w2 = watch(store.getState, `asyncWork.work.${id2}`)
        let doneCount = 0;
        let unsubscribe1 = store.subscribe(w1((newVal, oldVal, objectPath) => {
          try {
            expect(store.getState().asyncWork.work[id1].foo).toBe("bar")
          } catch (e) {
            var err = e
          } finally {
            doneCount++
            unsubscribe1()
            err ? done(err) : (doneCount === 2 && done())
          }
        }))
  
        let unsubscribe2 = store.subscribe(w2((newVal, oldVal, objectPath) => {
          try {
            expect(store.getState().asyncWork.work[id2].foo).toBe("baz")
          } catch (e) {
            var err = e
          } finally {
            doneCount++
            unsubscribe2()
            err ? done(err) : (doneCount === 2 && done())
          }
        }))
  
        const wrapper = mount(
          <Provider store={store} key="provider">
            <AsyncWork 
              asyncWorkKey="fooWork" 
              asyncWorkItems={ [
                { key: id1, work: () => new Promise((resolve) => setTimeout(() => resolve({ foo: "bar" }), 100)) },
                { key: id2, work: () => new Promise((resolve) => setTimeout(() => resolve({ foo: "baz" }), 100)) }
              ] }
              WrappedComponent={() => <div />} 
            />
          </Provider>
        );
      })
  
    });*/
});