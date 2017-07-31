import React from 'react'
import { withAsyncWork } from '@josulliv101/connect-async-work'
import { delay } from '../utils'

const work = [
	{ key: 'nestedParent', work : () => delay(1600).then(() => 'nestedParent work resolved') }
]

function NestedContent(props) {
  return (
  	<div>
  	  <h3>Nested Async Work Items</h3>
      <h4>parent work status is {props.loading ? 'loading...' : 'loaded'}</h4>
  	  <p>{props.nestedParent}</p>	
      <NestedContentChild />
  	</div>
  )
}

export default withAsyncWork(work)(NestedContent)

const work2 = [
  { key: 'nestedChild', work : () => delay(2600).then(() => 'nestedChild work resolved') }
]

var NestedContentChild = withAsyncWork(work2)(
  function Child(props) {
    return (
      <div>
        <h3>Child Async Work Items</h3>
        <h4>nested child work status is {props.loading ? 'loading...' : 'loaded'}</h4>
        <p>{props.nestedChild}</p> 
      </div>
    )
  }
)
