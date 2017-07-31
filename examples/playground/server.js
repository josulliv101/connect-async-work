/*eslint-disable no-console */
import express from 'express'
import serialize from 'serialize-javascript'

import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackConfig from './webpack.config'

import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { createStore, compose, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { StaticRouter } from 'react-router'
import {
  middleware as asyncWorkMiddleware, 
  reducer as asyncWorkReducer,
  AsyncWorkRenderer
} from '@josulliv101/connect-async-work'

import App from './components/App'

var favicon = require('serve-favicon')
var path = require('path')

const app = express()
app.use(favicon(path.join(__dirname, 'favicon.ico')))

const middlewares = [
  asyncWorkMiddleware, 
]

const reducer = combineReducers({
  asyncwork: asyncWorkReducer,
})

const enhancers = [
  applyMiddleware(...middlewares),
]

app.use(webpackDevMiddleware(webpack(webpackConfig), {
  publicPath: '/__build__/',
  stats: {
    colors: true
  }
}))

const HTML = ({ content, store }) => (
  <html>
    <head>
      <title>connect-async-work server rendering example</title>
      <meta charset="utf8"/>
    </head>
    <body>
      <div id="root" dangerouslySetInnerHTML={{ __html: content }}/>
      <script dangerouslySetInnerHTML={{ __html: `window.__initialState__=${serialize(store)};` }}/>
      <script src="/__build__/bundle.js"/>
    </body>
  </html>
)

app.use(function (req, res) {
  
  console.log('SERVER req for %s', req.url)

  const context = {}
  const store = createStore(reducer, compose(...enhancers))

  const component = () => (
    <Provider store={store}>
      <StaticRouter context={{}} location={req.url}>
        <App />
      </StaticRouter>
    </Provider>
  )

  AsyncWorkRenderer.renderToString(component())
    .then(handleResponse)
    .catch(e => console.log(e))

  function handleResponse(content) {
    if (context.url) {
      res.writeHead(301, {
        Location: context.url
      })
      res.end()
    } else {
      res.write(`
        <!doctype html>
        ${ReactDOMServer.renderToStaticMarkup(<HTML content={content} store={store.getState()} />)}
      `)
      res.end()
    } 
  }
})

app.listen(8080, function () {
  console.log('Server listening on http://localhost:8080, Ctrl+C to stop')
})


