import React, { Component } from 'react'
import { withAsyncWork } from '@josulliv101/connect-async-work'

@withAsyncWork([{ 
  key: 'foo', 
  work : () => Promise.resolve('foo work resolved') 
}])
export default class Foo extends Component {
  render() {
    const {foo, loading} = this.props
    return (
      <div>
        <h4>Foo Component</h4>
        <p>I am a react component class.</p>
        <p>{loading ? 'loading' : foo}</p>
      </div>
    )
  }
}
