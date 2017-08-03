import { createStore, compose, combineReducers, applyMiddleware } from 'redux'
import { middleware as asyncWorkMiddleware, reducer as asyncWorkReducer } from '@josulliv101/connect-async-work'

export function configureStore() {

  const devtools = typeof window === 'object' && window.devToolsExtension ?
    window.devToolsExtension : (() => noop => noop);
  
  const reducer = combineReducers({
    asyncwork: asyncWorkReducer,
  })

  const middlewares = [
    asyncWorkMiddleware
  ]

  const enhancers = [
    applyMiddleware(...middlewares),
    devtools()
  ]

  return createStore(reducer, compose(...enhancers))
}