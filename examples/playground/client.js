import 'babel-polyfill'

import React from 'react'
import { render } from 'react-dom'
import { createStore, compose, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import createHistory from 'history/createBrowserHistory'
import {middleware as asyncWorkMiddleware, reducer as asyncWorkReducer} from '@josulliv101/connect-async-work'

import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'
import createPalette from 'material-ui/styles/palette'
import { red, blue } from 'material-ui/colors'

import App from './components/App'


// Create a theme instance.
const theme = createMuiTheme({
  palette: createPalette({
    primary: blue,
    accent: red,
    type: 'light',
    overrides: {
      MuiCircularProgress: {
        // Name of the styleSheet
        primaryColor: {
          color: 'white',
        },
      },
    },
  }),
});

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
    <MuiThemeProvider theme={theme}>
      <Router history={history}>
        <App />
      </Router>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root')
)
