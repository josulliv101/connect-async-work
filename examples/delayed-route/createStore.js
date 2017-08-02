import { createStore, compose, combineReducers, applyMiddleware } from 'redux'
import { middleware as asyncWorkMiddleware, reducer as asyncWorkReducer } from '@josulliv101/connect-async-work'

export function configureStore() {

  const devtools = typeof window === 'object' && window.devToolsExtension ?
    window.devToolsExtension : (() => noop => noop);
  
  // Include the async work reducer
  const reducer = combineReducers({
    asyncwork: asyncWorkReducer,
  })

  // This example uses standard redux middleware. Checkout the redux-saga example too.
  const middlewares = [
    asyncWorkMiddleware
  ]

  const enhancers = [
    applyMiddleware(...middlewares),
    devtools()
  ]

  return createStore(reducer, compose(...enhancers))
}