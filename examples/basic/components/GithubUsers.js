import React, { Component } from 'react'
import { withAsyncWork } from '@josulliv101/connect-async-work'

const url = 'https://api.github.com/users'

@withAsyncWork([{ 
  key: 'users', 
  work : () => fetch(url)
                .then(resp => resp.json())
                .catch((e) => console.log('err', e))
}])
export default class GithubUsers extends Component {
  render() {
    const {users = [], loading} = this.props
    const style = {width: 120, height: 'auto', borderRadius: '50%'}
    return (
      <div>
        <h4>GithubUsers Component</h4>
        <p>I'm a react component class.</p>
        <p>load{loading ? 'ing' : 'ed'}</p>
        { users.map(user => <img key={user.id} src={user.avatar_url} style={style} /> ) }
      </div>
    )
  }
}
