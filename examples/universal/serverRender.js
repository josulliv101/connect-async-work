import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { Provider } from 'react-redux'
import { StaticRouter } from 'react-router'
import { batchedSubscribe } from '@josulliv101/connect-async-work'
//
import { batchAsyncWork } from './utils'
import {App, Html} from './components'
import { configureStore } from './redux/createStore'


export default function (req, res) {
  
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

  // Listen when the async work is done.
  let unsubscribe = store.subscribe(() => {
    // All data loaded for second pass
    const contentSecondPass = ReactDOMServer.renderToString(component())
    return handleResponse(contentSecondPass)
  })

  // Don't like calling 'renderToString' twice (above & below) -- but maybe the dispatched
  // actions associated with a url can be cached on the server so that 2 passes at
  // rendering (for pages with async data) only happens on the first load of a url.
  // Or another option may be to create a speedy custom renderer who's only purpose is
  // to fire off async work and knows to avoid parts of a site flagged as 'static'.

  // Render the html. This enables components to fire off async work.
  const contentFirstPass = ReactDOMServer.renderToString(component())

  // If the first render didn't fire off any async work, we're done, return the html
  if (Object.keys(store.getState().asyncwork.loadState).length === 0) {
    return handleResponse(contentFirstPass)
  }

  function handleResponse(content) {
    
    // Cleanup
    unsubscribe()

    if (context.url) {
      res.writeHead(301, {
        Location: context.url
      })
      res.end()
    } else {
      res.write(`
        <!doctype html>
        ${ReactDOMServer.renderToStaticMarkup(<Html content={content} store={store.getState()} />)}
      `)
      res.end()
    } 
  }
}

