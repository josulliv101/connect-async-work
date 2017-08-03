# connect-async-work

### Load async data / Redux connected / work with React-Router v4

This package is experimental. 

### Goals

- Attach async work to a React Component & connect it to the Redux Store
- Work with react-router v4 (both server side & client)
- Handle side effects in redux middleware/redux-saga middleware
- Be able to cancel requests
- Nested async routes
- Universal/Isomorphic (whatever you want to call it) friendly

### Run Universal Example

```sh
cd examples/universal
npm install
npm start
```

### Notice

Lots of inspiration taken from [redux-connect](https://github.com/makeomatic/redux-connect)