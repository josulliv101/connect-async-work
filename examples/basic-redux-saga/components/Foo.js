import React from 'react'
import axios, { CancelToken } from 'axios'
import { CANCEL } from 'redux-saga'

import { withAsyncWork } from '@josulliv101/connect-async-work'
import { delay } from '../utils'
import style from '../style/'

/*
function fetchAPI(url) {
  const source = CancelToken.source()
  const request = axios.get(url, { cancelToken: source.token })
  request[CANCEL] = () => source.cancel('React Component unmounted before async work resolved.')
  return request
}
*/
function fetchAPI(url) {
  const source = CancelToken.source()
  const request = axios.get(url, { cancelToken: source.token })
  request['CANCEL'] = () => source.cancel('React Component unmounted before async work resolved.')
  return request
}

const url = `https://reqres.in/api/users?delay=3`;

const work = [{ key: 'foo', work : () => fetchAPI(url) }]

function Foo(props) {
  console.log('Foo / render')
  return (
  	<div>
  		<h3>Foo Async Work</h3>
      <h4 style={style.loadStatus}>bar work status is {props.loading ? 'loading...' : 'loaded'}</h4>
  		<p>{JSON.stringify(props.foo)}</p>
  	</div>
  )
}

export default withAsyncWork(work)(Foo)