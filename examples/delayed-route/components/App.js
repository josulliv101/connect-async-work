import React from 'react'
import { connect } from 'react-redux'
import { Link, Route } from 'react-router-dom'
import { DelayRoute } from '@josulliv101/delay-route'
import createHistory from 'history/createBrowserHistory'
//
import { Bar, Foo, GithubUsers, Home } from './'

const history = createHistory()

function App({ globalLoading: loading }) {
  return (
    <div>
      <h4>Delay Route with Async Work Example</h4>
      <h1>
        App is: { loading ? 'loading...' : 'loaded' }
      </h1>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/foo">Foo</Link></li>
          <li><Link to="/bar">Bar</Link></li>
          <li><Link to="/users">Github Users</Link></li>
        </ul>
      </nav>
      <main id="main">
        {
          // The DelayRoute initially renders both the new and old route (new route is
          // hidden at first) until the delay <bool> changes to false based on store state.
          // There's a css rule tucked away in index.html which actually does the hiding.
        }
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

const mapStateToProps = ({ asyncwork: { loadState }}) => ({
  // Check if any async work is loading. This represents the whole App's loading state.
  // There could be nested async work going on or 1 component with lots of work.
  globalLoading: Object.keys(loadState).some(key => loadState[key] && loadState[key].loading),
})
export default connect(mapStateToProps)(App)