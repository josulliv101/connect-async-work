import raf from 'raf/polyfill'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import { Route, Switch as RouteSwitch, withRouter } from 'react-router-dom'
import Button from 'material-ui/Button'
import { DelayRoute } from '@josulliv101/delay-route'

import classNames from 'classnames'
import { withStyles, createStyleSheet } from 'material-ui/styles'
import { white, common } from 'material-ui/colors'
import Typography from 'material-ui/Typography'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import IconButton from 'material-ui/IconButton'
import MenuIcon from 'material-ui-icons/Menu'
import Settings from 'material-ui-icons/Settings'
import Fav from 'material-ui-icons/FavoriteBorder'
import AppDrawer from './AppDrawer'
import { CircularProgress } from 'material-ui/Progress';
import { FormControlLabel } from 'material-ui/Form';
import Switch from 'material-ui/Switch';

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
    'a, a:visited, a:active, a:link': {
      textDecoration: 'none',
      color: 'inherit',
    },
    '.delay-route > div:nth-child(2)': {
      display: 'none',
    },
    'h1,h2,h3,h4,h5,h6': {
      fontWeight: 400,
    },

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
  flex: {
    flex: 1,
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
  footer: {
    bottom: 0,
    left: 'auto',
    right: 0,
    position: 'fixed',
    width: 'calc(100% - 250px)',
    background: common.faintBlack,
    color: common.lightBlack,
    '& > p': {
      lineHeight: '64px',
      '& > :first-child': {
        position: 'relative',
        top: 3,
      }
    }
  },
  [theme.breakpoints.up(948)]: {
    content: {
      maxWidth: 900,
    },
  },
}));


const App = ({ loading, classes }, { asyncRender = false }) => (
  <div className={classes.root}>
    <AppBar elevation={1} className={classes.appBarShift}>
      <Toolbar className={classNames(classes.primaryColor)} >
        <Typography type="title" color="inherit" className={classes.flex}>
          playground
        </Typography>
        <IconButton color="inherit">
          <Settings />
        </IconButton>
      </Toolbar>
      { loading && <CircularProgress 
        className={classNames(classes.progress, classes.primaryColor)} 
        size={32} color="primary" /> }
    </AppBar>
    <AppDrawer
      className={classes.drawer}
      docked={true}
      routes={{ routes: getRoutes() }}
      onRequestClose={noop => noop}
      open={true}
    />
    <section className={classes.content}>
      <main className="delay-route" >
        <DelayRoute delay={!asyncRender && loading} >
          <RouteSwitch>
            { getRoutes()
                .reduce((arr, item) => arr.concat(item.routes), [])
                .map( ({label, ...route}) => <Route key={label} {...route} /> ) 
            }
          </RouteSwitch>
        </DelayRoute>
{/*        <div>
          <FormControlLabel control={<Switch />} label="Delay routes with async work" />
          <FormControlLabel control={<Switch />} label="Show Placeholder Content while loading" />
          <IconButton color="inherit">
            <Settings /> Reset Redux Store (so routes with async work will need loading again)
          </IconButton>        
        </div>*/}
      </main>
    </section>
    <footer className={classes.footer}>
      <Typography align="center" color="inherit"><Fav style={{width: 16, height: 16}} />  Check out the next version of <a style={{fontWeight: 500}} target="_blank" href="https://material-ui-1dab0.firebaseapp.com/">Material-UI</a>.</Typography>
    </footer>
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
