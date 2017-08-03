# connect-async-work

This package is experimental & still a work in progress. It's meant as a learning tool for anyone interested in React Fiber custom renderers,  async requests with React Router v4 (server & client). 

React version: 16.0.0-beta.2

#### Goals (still in progress)
- Universal/isomorphic (whatever you want to call it)
- Easily attach async work to a React Component & connect it to the Redux Store
- Work with react-router v4 (both server side & client)
- Route Transitions
	- Delay router transitions
	- No delay and show async content as it comes in
	- Display a CNN/LinkedIn-style content placeholder 
- Work with typical redux middleware/redux-saga middleware
- Be able to cancel requests
- Nested async routes

Run Basic Example
------------

```sh
cd examples/basic
npm install
npm start
```

