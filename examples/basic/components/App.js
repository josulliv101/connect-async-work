import React from 'react'
import { connect } from 'react-redux'
import { Link, Route, Switch as NoDelaySwitch, withRouter } from 'react-router-dom'
import { AsyncSwitch } from '@josulliv101/connect-async-work'
import { Home, Foo, Bar, Multi } from './'
import style from '../style'
import { toggleDelayRouteTransitions } from '../actions/settings'

function App(props) {

  const routes = [
    { path: '/', exact: true, component: Home, label: 'Home' },
    { path: '/foo', component: Foo, label: 'Foo' },
    { path: '/bar', component: Bar, label: 'Bar' },
    { path: '/multi', component: Multi, label: 'Multi' },
  ]

  const NavItem = ({path, label}) => (
    <li key={path} style={style.link}>
      <Link to={path}>{label}</Link>
    </li>
  )
  // console.log('props', props)
  const Switch = props.delayRoutes ? AsyncSwitch : NoDelaySwitch

  return (
    <div style={style.root}>
      <div style={style.status}>
        {props.loading && <div className="loader" />}
      </div>
      <div style={style.main}>
        <ul style={style.nav}>
          { routes.map(NavItem) }
        </ul>
        <div style={style.bd}>
          <Switch loading={props.loading} >
            { routes.map(({label, ...route}) => <Route key={label} {...route} />) } 
          </Switch>
        </div>
      </div>
      <div style={style.controls}>
        <form>
          <input 
            type="checkbox" 
            name="delay" 
            value="delayed" 
            checked={props.delayRoutes} 
            onChange={() => props.toggleDelayRouteTransitions()}
          /> Delay Route Transition (when async data not yet loaded)
        </form>
      </div>  
    </div>

  )
}

const mapStateToProps = ({settings, asyncwork: {loadState}}) => ({
  // Checks if any keys are loading. The load property on HOCs is only for specified work.
  loading: Object.keys(loadState).some(key => loadState[key] && loadState[key].loading),
  delayRoutes: settings.delayRouteTransitions,
})
export default withRouter(connect(mapStateToProps, { toggleDelayRouteTransitions })(App))
// export default App