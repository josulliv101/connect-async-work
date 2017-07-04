import React from 'react';
import { connect } from 'react-redux';

import { fetchCancel } from '../store';

export default function withAsyncWork(asyncWork, mapStateToProps, mapDispatchToProps, mergeProps, options) {
  
  return (WrappedComponent) => {

    const {action, key: keyAsyncWork, keyReducer: keyReducerProps} = asyncWork;
    
    const finalMapStateToProps = (state, ownProps) => {
      const keyReducer = typeof keyReducerProps === 'function' ? keyReducerProps(state, ownProps) : (keyReducerProps || keyAsyncWork);
      return {
        ...mapStateToProps(state, ownProps),
        keyAsyncWork,
        keyReducer,
        // Keys can be functions in case you want to include a match param from url in key
        [keyAsyncWork]: state.asyncWork[keyReducer],
        loading: state.asyncWork.loadState[keyReducer] && state.asyncWork.loadState[keyReducer].loading,
        cached: state.asyncWork.loadState[keyReducer] && state.asyncWork.loadState[keyReducer].loaded,
      };
    };

    const customMapDispatchToProps = Object.assign({}, mapDispatchToProps, {fetchCancel, action});

    class AsyncWorkComponent extends React.Component {
      
      static asyncWork = true;

      shouldComponentUpdate(nextProps, nextState) {
/*        console.log('async:: loading', this.props.loading, nextProps.loading);
        console.log('async:: location.pathname', this.props.location.pathname, nextProps.location.pathname);*/

        // Hold off on render on initial route change
        if (this.props.location.pathname !== nextProps.location.pathname) {
          console.log('aynsc-decorator', 'Hold off on render on initial route change');
          return false;
        }
        return true;
      }

      componentWillMount() {
        console.log('async componentWillMount', this.props);
        const { id, cached, keyReducer, loading } = this.props;
        if (!cached && !loading) this.props.action(id, keyReducer);
      }

      componentWillUnmount() {
        const { keyReducer, loading, fetchCancel } = this.props;
        if (loading) fetchCancel(keyReducer);
      }

      render() {
        return <WrappedComponent {...this.props} />;
      }
    };

    const c =  connect(finalMapStateToProps, customMapDispatchToProps, mergeProps, options)(AsyncWorkComponent);
    c.asyncWork = true;
    return c;
  };
}