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
  const request = axios.get(url, { 
    cancelToken: source.token, 
    transformResponse: axios.defaults.transformResponse.concat((resp) => {
      return resp.data
    }) 
  })
  request['CANCEL'] = () => source.cancel('React Component unmounted before async work resolved.')
  return request
}

const url = `https://reqres.in/api/users?delay=3`;

const work = [{ key: 'users', work : () => fetchAPI(url) }]

function Foo({loading, users = []}) {
  console.log('Foo / render')
  return (
  	<div>
  		<h3>Foo Async Work</h3>
      <h4 style={style.loadStatus}>bar work status is {loading ? 'loading...' : 'loaded'}</h4>
  		<ul>
        {users.map(user => <li key={user.id}>{user.first_name}</li>)}  
      </ul>
  	</div>
  )
}

export default withAsyncWork(work)(Foo)