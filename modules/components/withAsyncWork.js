import React from 'react'
import { connect } from 'react-redux'
import hoistNonReactStatic from 'hoist-non-react-statics';

import AsyncWork from './AsyncWork'
import { workState, loadState } from '../store'

export default function withAsyncWork(workItems = []) {

  return (WrappedComponent) => {

    const mapStateToProps = (state, {match = {params: {}}}) => {

      // The workItem keys can be <string> | <funct> - convert fns to strings here
      const keys = workItems.map(({key}) => _getKey(key, match))

      // Map each work item's key to its work in the redux store
      const workKeys = keys.reduce((obj, key) => { obj[key] = workState(state)[key] || undefined; return obj; }, {});

      return {
        keys,
        loading: keys.some(key => loadState(state)[key] && loadState(state)[key].loading),
        loaded: keys.every(key => loadState(state)[key] && loadState(state)[key].loaded),
        workItems,
        ...workKeys,
        // The only way its key would exist is if it has already been initialized.
        // It could possibly already exist if loaded and cancelled, or in process of loading.
        doWorkCalled: keys.every(key => loadState(state)[key] && (loadState(state)[key].loaded || loadState(state)[key].loading))
      };
    };

    const Enhanced = connect(mapStateToProps)(({ workInitialized, workItems, ...props }) => (
        <AsyncWork 
          rootCmp={Enhanced}
          dispatch={props.dispatch}
          doWorkCalled={props.doWorkCalled}
          keys={props.keys}
          loaded={props.loaded}
          loading={props.loading}
          // Pass on a copy of work items where any work item <func>keys are swapped for <string>keys
          workItems={workItems.map((item, i) => ({ key: props.keys[i], work: item.work }))}>
          <WrappedComponent {...props} />
        </AsyncWork>
      )
    )

    Enhanced.asyncWork = true
    hoistNonReactStatic(Enhanced, AsyncWork);
    return Enhanced
  }
}

function _getKey(key, match) {
  return key && typeof key === 'function' ? key(match) : key
}