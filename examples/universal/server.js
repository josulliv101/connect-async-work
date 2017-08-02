import express from 'express'
import path from 'path'
import favicon from 'serve-favicon'
import serialize from 'serialize-javascript'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackConfig from './webpack.config'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { Provider } from 'react-redux'
import { StaticRouter } from 'react-router'
import { batchedSubscribe } from '@josulliv101/connect-async-work'
//
import { batchAsyncWork } from './utils'
import App from './components/App'
import { configureStore } from './redux/createStore'

const app = express()
const compiler = webpack(webpackConfig)

app.use(favicon(path.join(__dirname, 'favicon.ico')))
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
      <meta charSet="utf8"/>
      <style dangerouslySetInnerHTML={{ __html: '#main>:nth-child(2){display:none;}' }} />
    </head>
    <body>
      <div id="app" dangerouslySetInnerHTML={{ __html: content }}/>
      <script dangerouslySetInnerHTML={{ __html: `window.__initialState__=${serialize(store)};` }}/>
      <script src="/__build__/bundle.js"/>
    </body>
  </html>
)

app.use(function (req, res) {
  
  console.log('SERVER req for %s', req.url)

  const context = {}

  // Add an enhancer to the store that only emits once all the async work is complete.
  // It doesn't emit for anything else... only on async work completion (if any).
  // This enhancer is only included on the server.
  const store = configureStore(undefined, batchedSubscribe(batchAsyncWork))

  const component = () => (
    <Provider store={store}>
      <StaticRouter context={{}} location={req.url}>
        <App />
      </StaticRouter>
    </Provider>
  )

  // Listen for when the async work is done (if any).
  let unsubscribe = store.subscribe(() => {
    const content = ReactDOMServer.renderToString(component())
    return handleResponse(content)
  })

  // Don't like calling 'renderToString' twice -- but maybe the async work (the work itself, 
  // not the results) associated with a url can be cached on the server so that rendering twice 
  // only happens on first load.

  // Render the html. This fires off async work associated with components.
  const contentFirstPass = ReactDOMServer.renderToString(component())
  
  // If the first render didn't fire off any async work, we're done, return the html
  if (Object.keys(store.getState().asyncwork.loadState).length === 0) {
    return handleResponse(contentFirstPass)
  }

  function handleResponse(content) {
    
    // Listener is no longer needed
    unsubscribe()

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


