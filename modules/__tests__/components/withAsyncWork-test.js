import expect from 'expect'
import sinon from 'sinon'
import { mount, render } from 'enzyme'

import React from 'react'

import AsyncWork from '../../components/AsyncWork'
import withAsyncWork from '../../components/withAsyncWork'

describe('withAsyncWork HOC', () => {

  const context = { 
      store: { 
        getState: () => ({ 
          asyncwork: { 
            work: { 
              foo: 'foo data',
              bar: null,
              foo123: 'foo123 created by fn',
            }, 
            loadState: { 
              foo: {
                loaded: true, 
                loading: false,
              }
            }
          }
        }), 
        dispatch: noop => noop, 
        subscribe: noop => noop 
      },
  }

  const work = () => Promise.resolve('done');
  const workResolved = [{ key: 'foo', work }]
  const workResolvedFnKey = [{ key: (match) => `foo${match.params.id}`, work }]
  const workUninitialized = [{ key: 'bar', work }]
  const workMulti = [{ key: 'foo', work }, { key: 'bar', work }, { key: 'baz', work }]

  describe('Props', () => {

    it('passes the work keys on to <Enhanced/>', () => {
      const FooCmp = ({keys}) => <div>{`${keys[0]} / length of ${keys.length}`}</div>
      const Enhanced = withAsyncWork(workResolved)(FooCmp)
      const wrapper = mount(<Enhanced />, { context })
      expect(wrapper.text()).toBe('foo / length of 1')
    })


    it('respects the order of work keys passed on to wrapped cmp', () => {

      // For example, the second work item will always match the second key in the prop's array of keys 

      const Enhanced = withAsyncWork(workMulti)(MockWrappedCmp)
      const wrapper = mount(<Enhanced />, { context })

      expect(wrapper.text()).toBe('foo, bar, baz')

      function MockWrappedCmp({ keys: [first, second, third] }) {
        return (
          <div>{`${first}, ${second}, ${third}`}</div>
        )
      }
    })

    it('indicates that work has not been requested', () => {
      
      const Enhanced = withAsyncWork(workUninitialized)(props => <div/>)
      const wrapper = mount(<Enhanced />, { context });
      const props = wrapper.find(AsyncWork).props()
      expect(props.doWorkCalled).toBe(false)
    })

    it('indicates that work has been requested', () => {
      
      const Enhanced = withAsyncWork(workResolved)(props => <div/>)
      const wrapper = mount(<Enhanced />, { context });
      const props = wrapper.find(AsyncWork).props()
      expect(props.doWorkCalled).toBe(true)
    })

    it('passes the work items <string>keys as props to <Enhanced />', () => {
      
      const Enhanced = withAsyncWork(workResolved)(props => <div>{props.foo}</div>)
      const wrapper = mount(
        <Enhanced />,
        { context }
      );
      expect(wrapper.text()).toBe('foo data')
    })

    it('passes the work items <function>keys as props to <Enhanced />', () => {
      
      const Enhanced = withAsyncWork(workResolvedFnKey)(props => <div>{props.foo123}</div>)
      const wrapper = mount(
        // A Route will typically be responsible for including `match` in the props
        <Enhanced match={{params: {id: 123}}} />,
        { context }
      );
      expect(wrapper.text()).toBe('foo123 created by fn')
    })
  });

  describe('Render', () => {

    it('has custom props passed down to Wrapped Component', () => {
        
      const Enhanced = withAsyncWork([])(props => <div>{props.customProp}</div>)
      const wrapper = mount(
        <Enhanced customProp="bar" />,
        { context }
      );

      expect(wrapper.text()).toBe("bar")
    })
  });

})