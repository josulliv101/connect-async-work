import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link, Route, Switch, withRouter } from 'react-router-dom'
import { withAsyncWork, AsyncSwitch } from '@josulliv101/connect-async-work'
import { delay } from '../utils'
import style from '../style'

const work = [
	{ key: 'nestedRoutesParent', work : () => delay(1600).then(() => 'nestedRoutesParent work resolved') }
]

class NestedRoutes extends Component {

  render() {
    const NavItem = ({path, label, match}) => (
      <li key={path} style={style.link}>
        <Link to={path}>{label}</Link>
      </li>
    )
    const {match} = this.props
    const routes = [
      { path: '/nested-routes/foo', component: NestedRoutesFoo, label: 'Nested Routes Foo', match },
      { path: '/nested-routes/bar', component: NestedRoutesBar, label: 'Nested Routes Bar', match }
    ]
    console.log('NestedRoutesParent render', this)
    return (
      <div>
        <h3>Nested Routes Async Work Items</h3>
        <h4 style={style.loadStatus}>parent work status is {this.props.loading ? 'loading...' : 'loaded'}</h4>
        <p>{this.props.nestedRoutesParent}</p> 
        <hr />
        <ul>
          { routes.map(NavItem) }
        </ul>
        <div style={{marginLeft: 32}}>
          loc: {this.props.location && this.props.location.pathname}
          
          <AsyncSwitch 
            location={this.props.location} 
            nested={true}
          >
            {routes.filter(route => !!route.component).map(({match, label, ...route}) => <Route key={route.path} {...route}  />) } 
          </AsyncSwitch>   
        </div>
      </div>
    )    
  }
}

export default withAsyncWork(work)(NestedRoutes)

const work2 = [
  { key: 'nestedChildFoo', work : () => delay(4600).then(() => 'nested Child Route Foo work resolved') }
]

var NestedRoutesFoo = (
  
  function Child(props) {
    console.log('NestedRoutesFoo render', props)

    return (
      <div>
        <h3>NestedRoutesFoo Async Work Items</h3>
        <h4 style={style.loadStatus}>nested child work status is {props.loading ? 'loading...' : 'loaded'}</h4>
        <p>{props.nestedChildFoo}</p> 
      </div>
    )
  }
)

function NestedRoutesBar(props) {
  return (
    <div>
      <h3>NestedRoutesBar No Work Items</h3>
      <h4 style={style.loadStatus}>nested child work status is {props.loading ? 'loading...' : 'loaded'}</h4>
      <p>No async work</p> 
    </div>
  )
}
