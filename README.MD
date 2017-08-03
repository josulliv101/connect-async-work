# connect-async-work

## Redux connected React component that loads async data & works with React-Router v4

This package is experimental. 

## Goals

- Easily attach async work to a React Component & connect it to the Redux Store
- Work with react-router v4 (both server side & client)
- Universal/isomorphic (whatever you want to call it)
- Route Transitions
	- Delay router transitions until async content loaded
	- No transition delay and show async content as it comes in
	- Display a CNN/LinkedIn-style content placeholder while async content loads
- Work with typical redux middleware/redux-saga middleware
- Be able to cancel requests
- Nested async routes

Run Universal Example
---------------------

```sh
cd examples/universal
npm install
npm start
```

## Notice

Not a fork but lots of inspiration taken from [redux-connect](https://github.com/makeomatic/redux-connect)