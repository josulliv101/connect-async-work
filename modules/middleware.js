import invariant from 'invariant'

import { asyncWorkInit, asyncWorkResolve, asyncWorkError } from './store'


const ASYNC_WORK_INIT = asyncWorkInit().type

export const asyncWork = store => next => action => {
  
  const { key, work } = action.meta;

  if (action.type !== ASYNC_WORK_INIT) {
    return next(action)
  }
  
  invariant(
    work,
    `There isn't any work associated with the ${ASYNC_WORK_INIT} action.`
  )

  invariant(
    key,
    `There isn't a key associated with the ${ASYNC_WORK_INIT} action.`
  )

  if (!work) {
    return next(action)
  }
  
  // Updates global state with each work item
  for (let i =0; i < work.length; i++) {
    next(asyncWorkInit(work[i].key))
  }

  const promises = work.map(item => item.work())
  
  return Promise.all(promises).then(
    results => handleSuccess(work, store, results, next, asyncWorkResolve, key),
    error => handleError(work, store, error, next, asyncWorkError, key),
  )
}

function handleSuccess(work, store, results, next, asyncWorkResolve, key) {
  
  for (let i =0; i < work.length; i++) {
    next(asyncWorkResolve(work[i].key, results[i]))
  }

  // const a = next(asyncWorkResolve(key, result[0]))
  // console.log('result', result, store.getState().asyncWork.work);
  // return a;
}

function handleError(work, store, error, next, asyncWorkError, key) {
  for (let i =0; i < work.length; i++) {
    next(asyncWorkError(work[i].key, error))
  }
}