import React from 'react'
import PropTypes from 'prop-types'
import invariant from 'invariant'

import { asyncWorkInit, asyncWorkCancel, isLoaded, isLoading, BASE } from '../store'

export function withAsyncWork(asyncWorkKey, asyncWorkItems = []) {

  return (WrappedComponent) => {

    return class withAsyncWork extends React.Component {

      static asyncWork = true
      static asyncWorkDone = false
      static asyncWorkKey = asyncWorkKey
      static asyncWorkKeys = asyncWorkItems


      render() {

        let asyncWorkKeys2 = asyncWorkItems.map(item => {
          return item.key
        });

        const addedProps = { 
          asyncWorkItems, 
          asyncWorkKey, 
          asyncWorkKeys: asyncWorkKeys2, 
          WrappedComponent
        };
        return <AsyncWork {...this.props} {...addedProps} />
      }
    }
  }
}

class AsyncWork extends React.Component {

  static propTypes = {
    action: PropTypes.object,
    asyncWorkItems: PropTypes.arrayOf(PropTypes.object),
    asyncWorkKey: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func, // Incorporate a param id into the key
    ]),
    asyncWorkKeys: PropTypes.arrayOf(PropTypes.string),
    children: PropTypes.node,
    loading: PropTypes.bool, // True if all aync work is done.
    match: PropTypes.object, // Most likely provided by a Route
  };
  
  static contextTypes = { store: PropTypes.object };

  static defaultProps = {
    asyncWorkItems: [],
    match: { params: {}},
  };

  constructor(props, context) {

    super(props);

    invariant(
      context.store,
      `A store needs to be included in the AsyncWork component's context.`
    )

    this.key = this.getAsyncWorkKey(this.props.asyncWorkKey)

  }

  componentWillMount() {
    const { props: { asyncWorkItems: work }, key, context: { store } } = this;

    for (let i=0; i<work.length; i++) {
      const key = work[i].key;
      if (key && !this.isLoaded(key) && !this.isLoading(key)) {
        store.dispatch(asyncWorkInit(key, work))
      }
    }
  }

  componentWillUnmount() {
    const { props: { asyncWorkItems: work }, key, context: { store } } = this;
    for (let i=0; i<work.length; i++) {
      const key = work[i].key;
      if (this.isLoading(key)) {
        store.dispatch(asyncWorkCancel(key))
      }
    }
  }

  render() {

    const { key, props: { children, WrappedComponent, ...props } } = this
    const addedProps = {
      asyncWorkKey: key,
      [key]: this.getWorkFromState(key),
      loading: this.isLoading(key),
    }

    if (!WrappedComponent) return null;

    return (<WrappedComponent {...props} {...addedProps} />);
  }

  //// Helpers //// 

  getAsyncWorkKey   = (key, match = this.props.match) => typeof key === 'function' ? key(match) : key
  isLoading         = (key) => isLoading(this.getState(), key);
  isLoaded          = (key) => isLoaded(this.getState(), key);
  getState          = () => this.context.store.getState()

  getWorkFromState(key, globalState = this.getState()) {
    if (!key) return null;
    return this.isLoaded(key) ? globalState[BASE].work && globalState[BASE].work[key] : null;
  }
}

export default AsyncWork;
