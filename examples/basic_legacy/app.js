import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, compose, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
// import { ConnectedRouter as Router } from 'react-router-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import createHistory from 'history/createBrowserHistory'
import { 
  middleware as asyncWorkMiddleware, reducer as asyncWorkReducer 
} from '@josulliv101/connect-async-work'

import * as reducers from './reducers'
import { App } from './components'

const devtools = typeof window === 'object' && window.devToolsExtension ?
  window.devToolsExtension : (() => noop => noop);

const history = createHistory()

const reducer = combineReducers({
  asyncwork: asyncWorkReducer,
  ...reducers,
})

// Add universal enhancers here
let enhancers = [devtools()];

const enhancer = compose(...[
	applyMiddleware(asyncWorkMiddleware),
	...enhancers
]);


const store = createStore(reducer, enhancer)

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById('app')
)
