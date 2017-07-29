import expect from 'expect'
import sinon, { spy } from 'sinon'
import { mount, render } from 'enzyme'

import React from 'react'

import AsyncWorkRenderer from '../../renderers/AsyncWorkRendererFiber'
import withAsyncWork from '../../components/withAsyncWork';


const store = { 
  getState: () => ({ asyncwork: { work: {}, loadState: {}}}), 
  dispatch: noop => noop, 
  subscribe: noop => noop
}

const work = [{key: 'foo', work: () => Promise.resolve(true) }];

function MockCmp1() {
  return <main />
}

const Enhanced1 = withAsyncWork(work)(MockCmp1)

function App() {
  return (
    <div>
      <Enhanced1 store={store} />
    </div>
  )
}


describe('<AsyncWorkRenderer />', () => {

  describe('Rendering', () => {

    describe('to Promises', () => {

/*      it('returns promises representing async work added with withAsyncWork HOC', () => {
        const promises = AsyncWorkRenderer.renderToPromises( <App /> )
        expect(promises.length).toBe(1);
      })*/

    });

    // The promise returned represents ALL work being done for that cmp
    describe('to String', () => {
/*      it('returns a promise', () => {
        const p = AsyncWorkRenderer.renderToString(<App />)
        expect(p[Symbol.toStringTag]).toBe('Promise');
      })*/

    });

  });

/*  describe('Render', () => {
    it('throws an error if multiple children found', () => {
      expect(function() {
        mount(
          <AsyncWork>
            <div />
            <div />
          </AsyncWork>
        )
      }).toThrow(/expected to receive a single React element child/)
    })

    it('wraps the wrapped cmp with a AsyncWork tag when asyncRender context is true', () => {
      const wrapper = mount(
        <AsyncWork>
          <div />
        </AsyncWork>
      )
      const wrapperAsyncRender = mount(
        <AsyncWork>
          <div></div>
        </AsyncWork>,
        { context }
      )
      expect(wrapper.html()).toBe('<div></div>');
      expect(wrapperAsyncRender.html()).toMatch(/^<AsyncWork/i);
    })
  });*/

/*
  describe('Render', () => {

    it('renders the wrapped component', () => {
      
      const store = createStore(reducers)

      const wrapper = mount(
        <Provider store={store} key="provider">
          <AsyncWork WrappedComponent={() => <div>foo</div>} />
        </Provider>
      );

      expect(wrapper.text()).toBe("foo")
    })

    it('is in loading state when first mounted', () => {
      
      const store = createStore(reducers)

      const wrapper = mount(
        <Provider store={store} key="provider">
          <AsyncWork asyncWorkKey="foo-123" WrappedComponent={(props) => <div>{props.loading ? 'loading' : '...'}</div>} />
        </Provider>
      );

      expect(wrapper.text()).toBe("loading")
    })

    it('creates prop for the specified key', () => {
      
      const store = createStore(reducers)

      const wrapper = mount(
        <Provider store={store} key="provider">
          <AsyncWork 
            asyncWorkKey="foo" 
            WrappedComponent={ ({ foo }) => <div>{ foo === null ? 'exists' : '...' }</div> } 
          />
        </Provider>
      );

      expect(wrapper.text()).toBe("exists")

    })

    it('populates the specified key with correct data from global state', () => {
      
      const id = "fooWithData"
      const store = createStore(reducers, { [BASE]: { loadState: { [id]: { loading: false, loaded: true }}, work: { [id]: "foo with data" }}})

      const wrapper = mount(
        <Provider store={store} key="provider">
          <AsyncWork 
            asyncWorkKey={id}
            WrappedComponent={ (props) => <div>{ props.fooWithData }</div> } 
          />
        </Provider>
      );

      expect(wrapper.text()).toBe("foo with data")

    })

  });*/

/*  describe('Actions', () => {

    it('calls INIT action on mount', () => {
      
      const store = createStore(reducers)
      const proto = AsyncWork.prototype;

      spy(store, 'dispatch');
      spy(proto, 'componentWillMount');

      const wrapper = mount(
        <Provider store={store} key="provider">
          <AsyncWork 
            asyncWorkKey="foo-load" 
            WrappedComponent={() => <div />} 
          />
        </Provider>
      );
      
      expect(store.dispatch.calledOnce).toBe(true);
      expect(store.dispatch.getCall(0).args[0]).toEqual(asyncWorkInit("foo-load"));
      expect(proto.componentWillMount.calledOnce).toBe(true);

      store.dispatch.restore();
      proto.componentWillMount.restore();
    })

    it('does not INIT async work if already loaded', () => {
      
      const store = createStore(reducers, {asyncWork: {loadState: {'foo-do-not-load': {loading: false, loaded: true}}}})
      const proto = AsyncWork.prototype;

      spy(store, 'dispatch');
      spy(proto, 'componentWillMount');

      const wrapper = mount(
        <Provider store={store} key="provider">
          <AsyncWork 
            asyncWorkKey="foo-do-not-load" 
            WrappedComponent={() => <div />} 
          />
        </Provider>
      );
      
      expect(store.dispatch.called).toBe(false);
      expect(proto.componentWillMount.calledOnce).toBe(true);

      store.dispatch.restore();
      proto.componentWillMount.restore();
    })

    it('does not INIT async work if in process of loading', () => {
      
      const store = createStore(reducers, {asyncWork: {loadState: {'foo-do-not-load': {loading: true, loaded: false}}}})
      const proto = AsyncWork.prototype;

      spy(store, 'dispatch');
      spy(proto, 'componentWillMount');

      const wrapper = mount(
        <Provider store={store} key="provider">
          <AsyncWork 
            asyncWorkKey="foo-do-not-load" 
            WrappedComponent={() => <div />} 
          />
        </Provider>
      );
      
      expect(store.dispatch.called).toBe(false);
      expect(proto.componentWillMount.calledOnce).toBe(true);

      store.dispatch.restore();
      proto.componentWillMount.restore();
    })


    it('sends work off to be started in the INIT action', () => {
      
      const store = createStore(reducers)
      const work = [{ foo: 'I am work' }]

      const proto = AsyncWork.prototype;

      spy(store, 'dispatch');
      spy(proto, 'componentWillMount');

      const wrapper = mount(
        <Provider store={store} key="provider">
          <AsyncWork 
            asyncWorkKey="fooWork" 
            asyncWorkItems={ work }
            WrappedComponent={() => <div />} 
          />
        </Provider>
      );

      expect(store.dispatch.calledOnce).toBe(true);
      expect(store.dispatch.getCall(0).args[0]).toEqual(asyncWorkInit("fooWork", work));
      expect(proto.componentWillMount.calledOnce).toBe(true);

      store.dispatch.restore();
      proto.componentWillMount.restore();

    })

    it('will dispatch a CANCEL action if loading on unmount', () => {
      
      const store = createStore(reducers, {asyncWork: {loadState: {'foo-cancel': {loading: true, loaded: false}}}})
      const proto = AsyncWork.prototype;

      spy(store, 'dispatch');
      spy(proto, 'componentWillUnmount');

      const wrapper = mount(
        <Provider store={store} key="provider">
          <AsyncWork 
            asyncWorkKey="foo-cancel" 
            WrappedComponent={() => <div />} 
          />
        </Provider>
      );

      wrapper.unmount();
      
      expect(store.dispatch.calledOnce).toBe(true);
      expect(store.dispatch.getCall(0).args[0]).toEqual(asyncWorkCancel("foo-cancel"));
      expect(proto.componentWillUnmount.calledOnce).toBe(true);

      store.dispatch.restore();
      proto.componentWillUnmount.restore();
    })

  });*/
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