import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, compose, combineReducers, applyMiddleware } from 'redux'
// import createSagaMiddleware from 'redux-saga';
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import createHistory from 'history/createBrowserHistory'
import {middleware as asyncWorkMiddleware, reducer as asyncWorkReducer} from '@josulliv101/connect-async-work'

// import rootSaga from './sagas';
import * as reducers from './reducers'
import { App } from './components'
 
const devtools = typeof window === 'object' && window.devToolsExtension ?
  window.devToolsExtension : (() => noop => noop)

// const sagaMiddleware = createSagaMiddleware()

const middlewares = [
  // sagaMiddleware,
  asyncWorkMiddleware, 
]

const history = createHistory()

const reducer = combineReducers({
  asyncwork: asyncWorkReducer,
  ...reducers,
})

const enhancers = [
  applyMiddleware(...middlewares),
  devtools(),
]

const store = createStore(reducer, compose(...enhancers))

// sagaMiddleware.run(rootSaga)

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById('app')
)
