import React from 'react'
import { connect } from 'react-redux'
import { Link, Route } from 'react-router-dom'
import { DelayRoute } from '@josulliv101/delay-route'
//
import { Bar, Foo, GithubUsers, Home } from './'

function App({ globalLoading: loading }) {
  return (
    <div>
      <h2>Basic Server Example</h2>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/foo">Foo</Link></li>
          <li><Link to="/bar">Bar</Link></li>
          <li><Link to="/users">Github Users</Link></li>
        </ul>      
      </nav>
      <DelayRoute delay={loading}>
        <div>
          <Route exact path="/" component={Home}/>
          <Route path="/foo" component={Foo}/>
          <Route path="/bar" component={Bar}/>
          <Route path="/users" component={GithubUsers}/>
        </div>
      </DelayRoute>
    </div>
  )
}

const mapStateToProps = ({ asyncwork: { loadState }}) => ({
  // Check if any async work is loading. This represents the whole App's loading state.
  // There could be nested async work going on or 1 component with lots of work.
  globalLoading: Object.keys(loadState).some(key => loadState[key] && loadState[key].loading),
})

export default connect(mapStateToProps)(App)
