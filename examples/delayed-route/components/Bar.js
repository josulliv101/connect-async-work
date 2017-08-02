import React from 'react'
import { withAsyncWork } from '@josulliv101/connect-async-work'
////
import { delay } from '../utils'

const work = [{ 
  key: 'bar', 
  work : () => delay(1600).then(() => 'bar work resolved') 
}]

function Bar({loading, bar}) {
  return (
    <div>
      <h4>Bar Component</h4>
      <p>I'm a pure function.</p>
      <p>{loading ? 'loading' : bar}</p>
    </div>
  )
}

export default withAsyncWork(work)(Bar)
