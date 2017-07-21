import React from 'react'
import { withAsyncWork } from '@josulliv101/connect-async-work'
import { delay } from '../utils'
import style from '../style'

const work = [{ key: 'bar', work : () => delay(2600).then(() => 'bar work resolved')}]

function Bar(props) {
  return (
  	<div>
  	  <h3>And Bar Async Work</h3>
      <h4 style={style.loadStatus}>bar work status is {props.loading ? 'loading...' : 'loaded'}</h4>
  	  <p>{props.bar}</p>	
  	</div>
  )
}

export default withAsyncWork(work)(Bar)
