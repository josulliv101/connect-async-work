import React from 'react'
import PropTypes from 'prop-types'
import invariant from 'invariant'

import { asyncDoWork, asyncWorkCancel } from '../store'

class AsyncWork extends React.Component {

  static propTypes = {
    keys: PropTypes.arrayOf(PropTypes.string),
    workItems: PropTypes.arrayOf(PropTypes.object),
    children: PropTypes.node,
    loading: PropTypes.bool, // True if any async work is unresolved for each component
    match: PropTypes.object, // Most likely provided by a Route
    workInitialized: PropTypes.bool,
  };
  
  static contextTypes = { 
    asyncRender: PropTypes.bool,
  };

  static defaultProps = {
    workItems: [],
    match: { params: {} },
  };

  constructor(props, context) {
    super(props, context);
    console.log('AsyncWork / constructor')
    const {dispatch, workInitialized, workItems, rootCmp} = props;
    const {asyncRender} = context;

    // 'Initialized' work is either in the process of being resolved or already resolved.
    if (workInitialized === true) return;

    // The async work not attached to `AsyncWork Class` since work may be dependent on a match params
    this.workPromise = new Promise((resolve, reject) => {

      console.log('AsyncWork / constructor / Promise')

      // The middleware intercepts and handles creating actions for each work item which affects the store state
      dispatch(asyncDoWork(workItems, asyncRender, rootCmp, (data) => {
        console.log('AsyncWork / constructor / Callback')
        return resolve(data)
      }))
    });
  }
  componentWillReceiveProps(nextProps, nextContext) {
    console.log('AsyncWork / componentWillReceiveProps', this.props, nextProps)
  }
  componentWillMount() {
    console.log('AsyncWork / componentWillMount', this.props)
  }
  componentWillUpdate() {
    console.log('AsyncWork / componentWillUpdate')
  }
  componentDidUpdate() {
    console.log('AsyncWork / componentDidUpdate')
  }

/*  componentWillUnmount() {
    const { props: { asyncWorkItems: work }, key, context: { store } } = this;
    for (let i=0; i<work.length; i++) {
      const key = work[i].key;
      if (this.isLoading(key)) {
        store.dispatch(asyncWorkCancel(key))
      }
    }
  }*/

  render() {
    console.log('AsyncWork / render')
    // The propsToPass will contain the appropriate key for each item of
    // work... provided by the HOC which connects to the store
    const {children, workItems, ...propsToPass} = this.props;

    // The child is the wrapped component - already with neeeded props via HOC
    const ChildComponent = children ? React.Children.only(children) : null;

    // The `is` prop avoids a warning about needing lowercase elements.
    const elementProps = { is: 'AsyncWork', promise: this.workPromise };

    // Wrap the ChildComponent in an AsyncWork tag when doing async render.
    // This gives the renderer access to the promise object on the instance.
    // Without this custom element, renderer converts all to html tags 
    // which cannot have a custom props like a promise.
    // Better way to accomplish this?
    if (this.context.asyncRender) {
      return React.createElement('AsyncWork', elementProps, ChildComponent)
    }
    return ChildComponent
  }

}

export default AsyncWork;
