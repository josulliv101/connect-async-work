import React, { Component } from 'react'
import { withAsyncWork } from '@josulliv101/connect-async-work'
//
import { delay } from '../utils'

@withAsyncWork([{ 
  key: 'foo', 
  work : () => delay(1600).then(() => 'foo work resolved') 
}])
export default class Foo extends Component {
  render() {
    const {foo, loading} = this.props
    return (
      <div>
        <h4>Foo Component</h4>
        <p>I am a react component class.</p>
        <p>load{loading ? 'ing...' : 'ed'}</p>
        <p>{foo}</p>
      </div>
    )
  }
}
