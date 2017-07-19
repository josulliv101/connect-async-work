import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { ConnectedRouter as Router } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
import { 
  middleware as asyncWorkMiddleware, reducer as asyncWorkReducer 
} from '@josulliv101/connect-async-work'

import * as reducers from './reducers'
import { App } from './components'

const history = createHistory()

const reducer = combineReducers({
  asyncwork: asyncWorkReducer,
  ...reducers,
})

const store = createStore(reducer, applyMiddleware(asyncWorkMiddleware))

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById('app')
)
