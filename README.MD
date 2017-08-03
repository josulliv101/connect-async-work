# connect-async-work

This package is experimental. 

#### Goals
- Easily attach async work to a React Component & connect it to the Redux Store
- Work with react-router v4 (both server side & client)
- Universal/isomorphic (whatever you want to call it)
- Route Transitions
	- Delay router transitions
	- No delay and show async content as it comes in
	- Display a CNN/LinkedIn-style content placeholder 
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