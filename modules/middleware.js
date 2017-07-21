import invariant from 'invariant'

import { asyncDoWork, asyncWorkInit, asyncWorkResolve, asyncWorkError } from './store'


const ASYNC_DO_WORK = asyncDoWork().type

export const middleware = store => next => action => {

  if (action.type !== ASYNC_DO_WORK) {
    return next(action)
  }
  
  const { work, asyncRender, callback, RootCmp } = action.meta;

  invariant(
    work,
    `There isn't any work associated with the ${ASYNC_DO_WORK} action.`
  )

  invariant(
    callback,
    `There isn't a callback associated with the ${ASYNC_DO_WORK} action.`
  )
  
  if (!work) {
    return next(action)
  }
  
  // console.log('middleware doing work', asyncRender, work)

  // Don't update store in asyncRenders. All we care about is returning the promises.
  if (!asyncRender) {

    // Updates global state with each work item
    for (let i =0; i < work.length; i++) {
      console.log('middleware init action', work[i].key);
      next(asyncWorkInit(work[i].key));
    }

  }

  const promises = work.map(item => item.work())
  
  return Promise.all(promises)
  .then(
    results => handleSuccess(RootCmp, work, store, results, next, asyncWorkResolve),
    error => handleError(RootCmp, work, store, error, next, asyncWorkError),
  )
  .then(callback) // noop as default
}

function handleSuccess(RootCmp, work, store, results, next, asyncWorkResolve) {

  // Want the done flag on Async Cmps already in place before store gets updated
  RootCmp.asyncWorkResolved = true;

  for (let i =0; i < work.length; i++) {
    next(asyncWorkResolve(work[i].key, results[i]))
  }

  return ({work, results});
}

function handleError(RootCmp, work, store, error, next, asyncWorkError) {

  // Want the done flag on Async Cmps already in place before store gets updated
  RootCmp.asyncWorkResolved = true;
  
  for (let i =0; i < work.length; i++) {
    next(asyncWorkError(work[i].key, error))
  }
}