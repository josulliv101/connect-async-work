import React from 'react'
import { Link, Route } from 'react-router-dom'
//
import { Bar, Foo, GithubUsers, Home } from './'

export default function App() {
  return (
    <div>
      <h2>Basic Example</h2>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/foo">Foo</Link></li>
          <li><Link to="/bar">Bar</Link></li>
          <li><Link to="/users">Github Users</Link></li>
        </ul>      
      </nav>
      <div>
        <Route exact path="/" component={Home}/>
        <Route path="/foo" component={Foo}/>
        <Route path="/bar" component={Bar}/>
        <Route path="/users" component={GithubUsers}/>
      </div>
    </div>
  )
}
