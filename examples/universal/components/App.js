import React from 'react'
import { connect } from 'react-redux'
import { Link, Route, withRouter } from 'react-router-dom'
import { DelayRoute } from '@josulliv101/delay-route'
import { isLoading } from '@josulliv101/connect-async-work'
//
import { Bar, Foo, GithubUsers, Home } from './'

function App({ globalLoading: loading }) {
  return (
    <div>
      <h4>Universal Example</h4>
      <h2>App is load{loading ? 'ing...' : 'ed'}</h2>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/foo">Foo</Link></li>
          <li><Link to="/bar">Bar</Link></li>
          <li><Link to="/users">Github Users</Link></li>
        </ul>      
      </nav>
      <main id="main">
        <DelayRoute delay={loading}>
          <div>
            <Route exact path="/" component={Home}/>
            <Route path="/foo" component={Foo}/>
            <Route path="/bar" component={Bar}/>
            <Route path="/users" component={GithubUsers}/>
          </div>
        </DelayRoute>        
      </main>
    </div>
  )
}

const mapStateToProps = (state) => ({
  // Check if any async work is loading. This represents the whole App's loading state.
  globalLoading: isLoading(state),
})

export default withRouter(connect(mapStateToProps)(App))
