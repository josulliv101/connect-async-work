import React from 'react'
import PropTypes from 'prop-types'
import invariant from 'invariant'

import { asyncDoWork, asyncWorkCancel } from '../redux/store'

class AsyncWork extends React.Component {

  static propTypes = {
    children: PropTypes.node,
    doWorkCalled: PropTypes.bool,
    keys: PropTypes.arrayOf(PropTypes.string),
    loading: PropTypes.bool, // True if any async work is unresolved for each component
    workItems: PropTypes.arrayOf(PropTypes.object),
  };

  static defaultProps = {
    workItems: [],
  };

  static contextTypes = {
    apiClient: PropTypes.object,
  };

  constructor(props, context) {

    super(props, context);

    const {dispatch, doWorkCalled, workItems, rootCmp} = props;

    let promises;

    // This info maps to redux store
    if (doWorkCalled === true) return;
    
    promises = workItems.map(item => item.work(dispatch, props, context))

    this.action = asyncDoWork(workItems, promises, false)
    this.workPromises = this.action.meta.promises
    dispatch(this.action)
    this.cancelDoWork = this.action.meta.cancel
  }

  componentWillUnmount() {
    
    const { dispatch, loaded } = this.props;

    // No need to cancel if everything is loaded.
    if (loaded === true) return

    if (this.cancelDoWork) {
      dispatch(this.cancelDoWork())
    }
  }

  render() {
    const {children} = this.props;
    return children ? React.Children.only(children) : null
  }

}

export default AsyncWork;
