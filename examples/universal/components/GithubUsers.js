import React, { Component } from 'react'
import { withAsyncWork } from '@josulliv101/connect-async-work'
//
import api from '../api'

const style = {
  width: 120, 
  height: 'auto', 
  borderRadius: '50%',
}

@withAsyncWork([{ 
  key: 'users', 
  work : () => api('https://api.github.com/users')
}])
export default class GithubUsers extends Component {
  render() {
    const {users = [], loading} = this.props
    return (
      <div>
        <h4>GithubUsers Component</h4>
        <p>I am a react component class.</p>
        <p>load{loading ? 'ing...' : 'ed'}</p>
        { users.map(user => <img key={user.id} src={user.avatar_url} style={style} /> ) }
      </div>
    )
  }
}
