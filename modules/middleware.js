import invariant from 'invariant'

import { asyncDoWork, asyncWorkInit, asyncWorkResolve, asyncWorkCancel, asyncWorkError } from './store'

let cancelIds = []

const ASYNC_DO_WORK = asyncDoWork().type

export const middleware = store => next => action => {
  
  const id = action.meta && action.meta.id

  if (action.type !== ASYNC_DO_WORK && !cancelIds.includes(action.type)) {
    return next(action)
  }

  const { work, asyncRender, promises, callback, RootCmp } = action.meta || {};
  
  if (action.type === ASYNC_DO_WORK && !work) {
    return next(action)
  }

  if (action.type !== ASYNC_DO_WORK) {
    const {promises} = action.meta
    
    // Call the cancel method attached to any of the promises.
    promises.forEach(p => p['CANCEL'] && p['CANCEL']())
    return next(action)
  }

  console.log('cancelIds', cancelIds, id);

  // Add the id to the cancel array
  cancelIds = cancelIds.concat([id])

  Promise.all(promises).then(
    results => handleSuccess(work, store, results, next, asyncWorkResolve),
    error => handleError(work, store, error, next, asyncWorkError),
  )

  return next(action)
}

function handleSuccess(work, store, results, next, asyncWorkResolve) {

  console.log('middleware/handleSuccess');

  for (let i =0; i < work.length; i++) {
    // temp fix for issue with axios data structure on server
    const r = results && results[i] && results[i].status == 200 && results[i].data || results[i]
    next(asyncWorkResolve(work[i].key, r))
  }

  return ({work, results});
}

function handleError(work, store, error, next, asyncWorkError) {
  
  console.log('middleware/handleError', error);
  
  if (error.message === 'React Component unmounted before async work resolved.') {
    for (let i =0; i < work.length; i++) {
      console.log('middleware cancel action', work[i].key);
      next(asyncWorkCancel(work[i].key));
    }
    return 
  }

  for (let i =0; i < work.length; i++) {
    next(asyncWorkError(work[i].key, error))
  }
}