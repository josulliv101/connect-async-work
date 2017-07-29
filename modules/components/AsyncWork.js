import React from 'react'
import PropTypes from 'prop-types'
import invariant from 'invariant'

import { asyncDoWork, asyncWorkCancel } from '../store'

class AsyncWork extends React.Component {

  static propTypes = {
    children: PropTypes.node,
    doWorkCalled: PropTypes.bool,
    keys: PropTypes.arrayOf(PropTypes.string),
    loading: PropTypes.bool, // True if any async work is unresolved for each component
    workItems: PropTypes.arrayOf(PropTypes.object),
  };

  static contextTypes = { 
    asyncRender: PropTypes.bool,
  };

  static defaultProps = {
    workItems: [],
  };

  constructor(props, context) {

    super(props, context);
    console.log('AsyncWork / constructor')
    const {dispatch, doWorkCalled, workItems, rootCmp} = props;
    const {asyncRender} = context;
    let promises;

    // This info maps to redux store
    if (doWorkCalled === true) return;
    
    promises = workItems.map(item => item.work())
    

    this.action = asyncDoWork(workItems, promises, asyncRender)
    this.workPromises = this.action.meta.promises

    // Can return promise here from dispatch via middleware
    if (asyncRender !== true) {
      dispatch(this.action)
      this.cancelDoWork = this.action.meta.cancel
    }
  }

  componentWillUnmount() {
    
    const { dispatch, loaded } = this.props;

    console.log('AsyncWork componentWillUnmount - all loaded %s', loaded)
    
    // No need to cancel if everything is loaded.
    if (loaded === true) return

    if (this.cancelDoWork) {
      dispatch(this.cancelDoWork())
    }
  }

  render() {
    console.log('AsyncWork / render')
    // The propsToPass will contain the appropriate key for each item of
    // work... provided by the HOC which connects to the store
    const {children, workItems, ...propsToPass} = this.props;

    // The child is the wrapped component - already with neeeded props via HOC
    const ChildComponent = children ? React.Children.only(children) : null;

    // The `is` prop avoids a warning about needing lowercase elements.
    const elementProps = { is: 'AsyncWork', promise: this.workPromises };

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
