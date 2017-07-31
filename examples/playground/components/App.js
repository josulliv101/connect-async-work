import raf from 'raf/polyfill'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import { Route, Switch, withRouter } from 'react-router-dom'
import Button from 'material-ui/Button'
import { DelayRoute } from '@josulliv101/delay-route'

import classNames from 'classnames'
import { withStyles, createStyleSheet } from 'material-ui/styles'
import { white } from 'material-ui/colors'
import Typography from 'material-ui/Typography'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import IconButton from 'material-ui/IconButton'
import MenuIcon from 'material-ui-icons/Menu'
import LightbulbOutline from 'material-ui-icons/LightbulbOutline'
import AppDrawer from './AppDrawer'
import { CircularProgress } from 'material-ui/Progress';

// import 'typeface-roboto'
import getRoutes from '../routes'

const styleSheet = createStyleSheet('AppFrame', theme => ({

  '@global': {
    html: {
      boxSizing: 'border-box',
    },
    '*, *:before, *:after': {
      boxSizing: 'inherit',
    },
    body: {
      margin: 0,
      background: theme.palette.background.default,
      color: theme.palette.text.primary,
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      lineHeight: '1.2',
      overflowX: 'hidden',
      WebkitFontSmoothing: 'antialiased', // Antialiasing.
      MozOsxFontSmoothing: 'grayscale', // Antialiasing.
    },
    img: {
      maxWidth: '100%',
      height: 'auto',
      width: 'auto',
    },
    '.delay-route > div:nth-child(2)': {
      display: 'none',
    },
    'h1, h2, h3, h4, h5, h6': {
      fontWeight: 400,
    }
  },
  root: {
    display: 'flex',
    alignItems: 'stretch',
    minHeight: '100vh',
    width: '100%',
  },
  grow: {
    flex: '1 1 auto',
  },
  title: {
    marginLeft: 24,
    flex: '0 1 auto',
  },
  drawer: {
    width: '250px',
  },
  appBarShift: {
    width: 'calc(100% - 250px)',
  },
  progress: {
    position: 'absolute',
    zIndex: 999,
    top: 0,
    left: `calc(50% - ${theme.spacing.unit * 2}px)`,
    transform: 'translate(-50%, 50%)',
    margin: `0 ${theme.spacing.unit * 2}px`,
  },
  primaryColor: {
    color: 'white',
  },
  content: theme.mixins.gutters({
    paddingTop: 80,
    flex: '1 1 100%',
    maxWidth: '100%',
    margin: '0 auto',
  }),
  [theme.breakpoints.up(948)]: {
    content: {
      maxWidth: 900,
    },
  },
}));


const App = ({ loading, classes }, { asyncRender = false }) => (
  <div className={classes.root}>
    <AppBar className={classes.appBarShift}>
      <Toolbar>
        <Typography type="title" color="inherit" noWrap>
          playground
        </Typography>
        <IconButton
          color="contrast"
        >
          <LightbulbOutline />
        </IconButton>
      </Toolbar>
      { loading && <CircularProgress 
        className={classNames(classes.progress, classes.primaryColor)} 
        size={32} color="primary" /> }
    </AppBar>
    <AppDrawer
      className={classes.drawer}
      docked={true}
      routes={getRoutes()}
      onRequestClose={noop => noop}
      open={true}
    />
    <div className={classes.content}>
      <main className="delay-route" >
        <DelayRoute delay={!asyncRender && loading} >
          <Switch>
            { getRoutes().map( ({label, ...route}) => <Route key={label} {...route} /> ) }
          </Switch>
        </DelayRoute>
      </main>      
    </div>
  </div> 
)

/*function NavItem({path: pathProp, label, id}) {
  const path = id ? pathProp.replace(':id', id) : pathProp
  return (
    <li key={path}>
      <Link to={path}>{label}</Link>
    </li>
  )
}*/

const mapStateToProps = ({asyncwork: {loadState}}) => ({
  // Checks if any keys are loading. The load property on HOCs is only for specified work.
  loading: Object.keys(loadState).some(key => loadState[key] && loadState[key].loading),
})

export default withRouter(compose(withStyles(styleSheet), connect(mapStateToProps))(App))
