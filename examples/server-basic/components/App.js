import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link, Route, Switch, withRouter } from 'react-router-dom'
import { DelayRoute } from '@josulliv101/delay-route'

import style from '../style/'
import getRoutes from '../routes'

const {bd, link, main, nav, root, status} = style
 
const App = ({ loading }, { asyncRender = false }) => (
  <div style={root}>
    <div style={main}>
      <ul style={nav}>
        { getRoutes().map(NavItem) }
      </ul>
      <main className="delay-route" style={bd}>
        <div style={style.status}>
          { loading && <div className="loader" /> }
        </div>
        <DelayRoute delay={!asyncRender && loading} >
          <Switch>
            { getRoutes().map( ({label, ...route}) => <Route key={label} {...route} /> ) }
          </Switch>
        </DelayRoute>
      </main>
    </div>
  </div> 
)

function NavItem({path: pathProp, label, id}) {
  const path = id ? pathProp.replace(':id', id) : pathProp
  return (
    <li key={path} style={link}>
      <Link to={path}>{label}</Link>
    </li>
  )
}

const mapStateToProps = ({asyncwork: {loadState}}) => ({
  // Checks if any keys are loading. The load property on HOCs is only for specified work.
  loading: Object.keys(loadState).some(key => loadState[key] && loadState[key].loading),
})

export default withRouter(connect(mapStateToProps)(App))
