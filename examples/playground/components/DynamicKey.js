import React from 'react'
import axios, { CancelToken } from 'axios'
import { CANCEL } from 'redux-saga'

import { withAsyncWork } from '@josulliv101/connect-async-work'
import { delay } from '../utils'

function fetchAPI(url) {
  const source = CancelToken.source()
  const request = axios.get(url, { cancelToken: source.token })
  request['CANCEL'] = () => source.cancel('React Component unmounted before async work resolved.')
  return request
}

const url = `https://reqres.in/api/users?delay=3&per_page=4`;

const work = [{ key: ({params = {}}) => `dynamic-${params.id}`, work : () => fetchAPI(url) }]

// The key in the redux store is dynamic based on id in match params. But it respects its index in keys array.
function DynamicKey({ loading, keys: [workKey], [workKey]: users, ...props }) {
  console.log('DynamicKey / render', props, workKey)
  return (
  	<div>
  		<h3>DynamicKey Async Work</h3>
      <h4>DynamicKey work status is {loading ? 'loading...' : 'loaded'}</h4>
  		<p>{users && users.data.map(item => <img key={item.id} src={item.avatar} />)}</p>
  	</div>
  )
}

export default withAsyncWork(work)(DynamicKey)