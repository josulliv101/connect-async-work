import React from 'react'
import serialize from 'serialize-javascript'

export default ({ content, store }) => (
  <html>
    <head>
      <title>connect-async-work universal example</title>
      <meta charSet="utf8"/>
      {/* 
        Up to the developer to hide the delayed route when new and old route are rendered. 
        It's an inconvenience, but the alternative is to wrap the route in a <div/> that's
        hidden -- would rather not change DOM structure.
      */}
      <style dangerouslySetInnerHTML={{ __html: '#main>:nth-child(2){display:none;}' }} />
    </head>
    <body>
      <div id="app" dangerouslySetInnerHTML={{ __html: content }}/>
      <script dangerouslySetInnerHTML={{ __html: `window.__initialState__=${serialize(store)};` }}/>
      <script src="/__build__/bundle.js"/>
    </body>
  </html>
)
