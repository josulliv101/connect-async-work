import React from 'react'
import PropTypes from 'prop-types'
import warning from 'warning'

import AsyncWork from '../components/AsyncWork';

export default function connectAsyncWork(asyncWork, mapStateToProps, mapDispatchToProps, mergeProps, options) { 
  return (WrappedComponent) => ({ action, key, loading, ...props }) => {
    const asyncWorkProps = { action, key, loading };
    return (
      <AsyncWork {...asyncWorkProps} >
        <WrappedComponent {...props} />
      </AsyncWork>
    )
  }
}
