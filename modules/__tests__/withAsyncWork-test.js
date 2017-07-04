import expect from 'expect'
import sinon from 'sinon'
import { mount, render } from 'enzyme'

import React from 'react'
import { createStore, combineReducers } from 'redux'
import PropTypes from 'prop-types'

import AsyncWork, { withAsyncWork }  from '../components/AsyncWork'
import { reducer } from '../store';

describe('withAsyncWork HOC', () => {


  const reducers = combineReducers({ asyncWork: reducer })
  const context = {
    context: { 
      store: createStore(reducers),
    },
    childContextTypes: { store: PropTypes.object }
  }

  describe('Initialization', () => {

    it('adds a key as a \'asyncWorkKey\' static variable', () => {
        
      const EnhancedComponent = withAsyncWork("keyFoo")(() => <div></div>)
      expect(EnhancedComponent.asyncWorkKey).toBe("keyFoo")

    })

    it('adds an \'asyncWorkItems\' array as a static variable', () => {
      
      const work = [{ key: "foo1" }, { key: "foo2" }]
      const EnhancedComponent = withAsyncWork("keyFoo", work)(() => <div></div>)
      expect(EnhancedComponent.asyncWorkKeys[0].key).toBe("foo1")
      expect(EnhancedComponent.asyncWorkKeys[1].key).toBe("foo2")
    })

    it('passes the asyncWorkKey as a prop down to Wrapped Component', () => {
        
      const EnhancedComponent = withAsyncWork("foo-AsyncKey")(props => <div>{props.asyncWorkKey}</div>)
      const wrapper = mount(
        <EnhancedComponent />,
        context
      );

      expect(wrapper.text()).toBe("foo-AsyncKey")
    })

    it('can set the asyncWorkKey with a passed-in function', () => {
        
      const EnhancedComponent = withAsyncWork(() => "foo-AsyncKey")(props => <div>{props.asyncWorkKey}</div>)
      const wrapper = mount(
        <EnhancedComponent />,
        context
      );

      expect(wrapper.text()).toBe("foo-AsyncKey")
    })

    it('can set an asyncWorkKey based on current match/location params', () => {
      
      // The match param is usually supplied as a prop by the Route, in this case we'll add it as custom prop
      const EnhancedComponent = withAsyncWork((match) => `foo-AsyncKey-${match.params.id}`)(props => <div>{props.asyncWorkKey}</div>)
      const wrapper = mount(
        <EnhancedComponent match={{params: { id: 123 }}} />,
        context
      );

      expect(wrapper.text()).toBe("foo-AsyncKey-123")
    })

    it('has custom props passed down to Wrapped Component', () => {
        
      const EnhancedComponent = withAsyncWork("fooAsyncKey")(props => <div>{props.foo}</div>)
      const wrapper = mount(
        <EnhancedComponent foo="bar" />,
        context
      );

      expect(wrapper.text()).toBe("bar")
    })
  });

})