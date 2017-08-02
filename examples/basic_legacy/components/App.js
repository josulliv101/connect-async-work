import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link, Route, Switch as NoDelaySwitch, withRouter } from 'react-router-dom'
import { AsyncSwitch } from '@josulliv101/connect-async-work'
import { Home, Foo, Bar, Multi, NestedContent, NestedRoutes } from './'
import style from '../style'
import { toggleDelayRouteTransitions } from '../actions/settings'

class App extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = { prevLocation: null, transitioning: false }
  }

  componentWillMount() {
    console.log("App / componentWillMount");
  }

  componentWillReceiveProps(nextProps, nextContext) {
    console.log('App / componentWillReceiveProps', this.props, nextProps)
    if (this.props.location !== nextProps.location) {
      this.setState({prevLocation: this.props.location, transitioning: true})
    }
    else {
      this.setState({ transitioning: false })
    }
  }

  componentWillUpdate() {
    console.log('App / componentWillUpdate')
  }

  componentDidUpdate() {
    console.log('App / componentDidUpdate')

  }

  render() {
    console.log("App/render");
    const props = this.props;

    const routes = [
      { path: '/', exact: true, component: Home, label: 'Home' },
      { path: '/foo', component: Foo, label: 'Foo' },
      { path: '/bar', component: Bar, label: 'Bar' },
      { path: '/multi', component: Multi, label: 'Multi' },
      { path: '/nested-content', component: NestedContent, label: 'Nested Content' },
      { path: '/nested-routes', component: NestedRoutes, label: 'Nested Routes Parent' },
      { path: '/nested-routes/foo', label: 'Nested Routes Child' },
    ]

    const NavItem = ({path, label}) => (
      <li key={path} style={style.link}>
        <Link to={path}>{label}</Link>
      </li>
    )
    // console.log('props', props)
    const Switch = props.delayRoutes ? AsyncSwitch : NoDelaySwitch

    // console.log('App.prevLocation', App.prevLocation)
    const loading = props.loading
    console.log('App. loading', loading)
    console.log('App. transitioning', this.state.transitioning)
    return (
      <div style={style.root}>
        <div style={style.main}>
          <ul style={style.nav}>
            { routes.map(NavItem) }
          </ul>
          <div style={style.bd}>
            <div style={style.status}>
              {props.loading && <div className="loader" />}
            </div>
            {
              (
                <Switch 
                  loading={loading}
                  transitioning={this.state.transitioning}
                  prevContext={this.state.prevLocation} 
                >
                  { routes.filter(route => !!route.component).map(({label, ...route}) => <Route key={label} {...route} />) } 
                </Switch>
              )
            }
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
}

const mapStateToProps = ({settings, asyncwork: {loadState}}) => ({
  // Checks if any keys are loading. The load property on HOCs is only for specified work.
  loading: Object.keys(loadState).some(key => loadState[key] && loadState[key].loading),
  delayRoutes: settings.delayRouteTransitions,
})
export default withRouter(connect(mapStateToProps, { toggleDelayRouteTransitions })(App))
// export default App