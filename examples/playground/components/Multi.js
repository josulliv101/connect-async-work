import React from 'react'
import { withAsyncWork } from '@josulliv101/connect-async-work'
import { delay } from '../utils'

const work = [
	{ key: 'multi1', work : () => delay(600).then(() => 'multi 1 work resolved') },
	{ key: 'multi2', work : () => delay(1600).then(() => 'multi 2 work resolved') }
]

function Multi(props) {
  return (
  	<div>
  	  <h3>Multiple Async Work Items</h3>
      <h4>bar work status is {props.loading ? 'loading...' : 'loaded'}</h4>
  	  <p>{props.multi1}</p>	
  	  <p>{props.multi2}</p>	
  	</div>
  )
}

export default withAsyncWork(work)(Multi)
