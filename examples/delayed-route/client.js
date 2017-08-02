import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
// import { BrowserRouter as Router } from 'react-router-dom'
// import createHistory from 'history/createBrowserHistory'
////
import { configureStore } from './createStore'
import { App } from './components'

const store = configureStore()
// const history = createHistory()

ReactDOM.render(
  <Provider store={store}>
  	<App />
  </Provider>,
  document.getElementById('app')
)
