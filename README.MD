# connect-async-work

This package is experimental & still a work in progress. It's meant as a learning tool for anyone interested in React Fiber custom renderers, getting async requests working with React Router v4 on both client and server. 

React version: 16.0.0-alpha.3

#### Goals (still in progress)
- Work with react-router v4
- Work with typical redux middleware/redux-saga middleware
- Be able to cancel requests
- Delay router transitions or be able to display 'is loading' cmp
- Work on server side
- Nested async routes

Run Examples
------------

```sh
npm install
npm run build
cd examples/basic
npm install
npm start
```

