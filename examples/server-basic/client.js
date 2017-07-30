import 'babel-polyfill'

import React from 'react'
import { render } from 'react-dom'
import { createStore, compose, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import createHistory from 'history/createBrowserHistory'
import {middleware as asyncWorkMiddleware, reducer as asyncWorkReducer} from '@josulliv101/connect-async-work'

import App from './components/App'
import './style/main.css'

const devtools = typeof window === 'object' && window.devToolsExtension ?
  window.devToolsExtension : (() => noop => noop)

const middlewares = [
  asyncWorkMiddleware, 
]

const history = createHistory()

const reducer = combineReducers({
	asyncwork: asyncWorkReducer,
})

const enhancers = [
  applyMiddleware(...middlewares),
  devtools(),
]

const store = createStore(reducer, window.__initialState__, compose(...enhancers))

render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root')
)
