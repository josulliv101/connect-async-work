import React, { Component } from 'react'
import { withAsyncWork } from '@josulliv101/connect-async-work'

const API = (url) => fetch(url).then(resp => resp.json()).catch(err => err)

@withAsyncWork([{ key: 'users', work : () => API('https://api.github.com/users') }])
export default class GithubUsers extends Component {
  render() {
    const {users = [], loading} = this.props
    return (
      <div>
        <h4>GithubUsers Component</h4>
        <p>load{loading ? 'ing' : 'ed'}</p>
        { users.map((user, i) => <Avatar key={i} {...user} />) }
      </div>
    )
  }
}

const style = { 
  width: 120, 
  height: 'auto', 
  borderRadius: '50%' 
}
const Avatar = ({avatar_url: url}) => <img  src={url} style={style} />