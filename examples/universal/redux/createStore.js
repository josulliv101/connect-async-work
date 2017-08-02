import { createStore, compose, combineReducers, applyMiddleware } from 'redux'
import { 
  middleware as asyncWorkMiddleware, 
  reducer as asyncWorkReducer
} from '@josulliv101/connect-async-work'

export function configureStore(initialState, ...enhancerAddOns) {

  const devtools = typeof window === 'object' && window.devToolsExtension ?
    window.devToolsExtension : (() => noop => noop);

  // Include the async work reducer
  const reducer = combineReducers({
    asyncwork: asyncWorkReducer,
  })

  const middlewares = [
    asyncWorkMiddleware
  ]

  const enhancers = [
    applyMiddleware(...middlewares),
    devtools(),
    ...enhancerAddOns
  ]

  return createStore(reducer, initialState, compose(...enhancers))
}