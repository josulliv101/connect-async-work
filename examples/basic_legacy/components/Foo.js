import React from 'react'
import { withAsyncWork } from '@josulliv101/connect-async-work'
import { delay } from '../utils'
import style from '../style'

const work = [{ key: 'foo', work : () => delay(1600).then(() => 'foo work resolved')}]

function Foo(props) {
  console.log('Foo / render')
  return (
  	<div>
  		<h3>Foo Async Work</h3>
      <h4 style={style.loadStatus}>bar work status is {props.loading ? 'loading...' : 'loaded'}</h4>
  		<p>{props.foo}</p>
  	</div>
  )
}

export default withAsyncWork(work)(Foo)