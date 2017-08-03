import expect from 'expect'
import { mount, render } from 'enzyme'
import React from 'react'
//
import AsyncWork from '../../components/AsyncWork'


describe('<AsyncWork />', () => {

  beforeEach(function () {

  })

  afterEach(function () {
    expect.restoreSpies()
  })

  describe('Life cycle hooks', () => {
    
    describe('Constructor', () => {

      it('adds <Array>promises of work to the instance', () => {
        const workItems= [{key: 'foo', work: () => Promise.resolve()}]
        const {node} = mount(<AsyncWork workItems={workItems} dispatch={noop => noop} />)
        expect(Array.isArray(node.workPromises)).toBe(true);
        expect(node.workPromises.length).toBe(1);
        expect(node.workPromises[0] instanceof Promise).toBe(true);
      })

    });

  });

  describe('Render', () => {

    it('throws an error if multiple children found', () => {
      expect(function() {
        mount(
          <AsyncWork dispatch={noop => noop}>
            <div />
            <div />
          </AsyncWork>
        )
      }).toThrow()
    })

  });

  describe('Actions', () => {

    it('dispatches WORK DO action when doWorkCalled is false (the default)', () => {
      const spy = expect.createSpy()
      const wrapper = mount(<AsyncWork dispatch={spy} />)
      expect(spy.calls.length).toEqual(1)
    })

    it('does not dispatch WORK DO action when work already requested', () => {
      const spy = expect.createSpy()
      const wrapper = mount(<AsyncWork doWorkCalled={true} dispatch={spy} />)
      expect(spy.calls.length).toEqual(0)
    })

    it('creates a uid for each WORK DO action', () => {
      const spy = expect.createSpy()
      const wrapper = mount(<AsyncWork dispatch={spy} />)
      const firstArg = spy.calls[0].arguments[0]
      expect(firstArg.type).toBe('@async-work/DO_WORK');
      expect(firstArg.meta.id).toExist();
    })

    it('will dispatch a WORK CANCEL action (id created from "do work" action) if loading on unmount', () => {
      
      const spy = expect.createSpy()
      const wrapper = mount(
        <AsyncWork dispatch={spy} />
      );

      wrapper.unmount();
      
      const id = spy.calls[0].arguments[0].meta.id;
      const idDispatched = spy.calls[1].arguments[0].type;

      expect(spy.calls.length).toBe(2);
      expect(idDispatched).toEqual(id);

    })

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
})