import React from 'react'
import { withAsyncWork } from '@josulliv101/connect-async-work'

const work = [{ 
  key: 'bar', 
  work : () => Promise.resolve('bar work resolved') 
}]

function Bar({loading, bar}) {
  return (
    <div>
      <h4>Bar Component</h4>
      <p>I am a pure function.</p>
      <p>{loading ? 'loading' : bar}</p>
    </div>
  )
}

export default withAsyncWork(work)(Bar)
