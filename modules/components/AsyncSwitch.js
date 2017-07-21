import React from 'react'
import PropTypes from 'prop-types'
import warning from 'warning'
import { matchPath } from 'react-router'

const ROUTE_MATCHED = 'route_matched';
const ROUTE_PREV = 'route_prev';

/**
 * The public API for rendering the first <Route> that matches.
 */
class AsyncSwitch extends React.Component {

  static contextTypes = {
    router: PropTypes.shape({
      route: PropTypes.object.isRequired
    }).isRequired
  }

  static propTypes = {
    children: PropTypes.node,
    location: PropTypes.object,
    prevContext: PropTypes.object
  }

  componentWillReceiveProps(nextProps, nextContext) {
    warning(
      !(nextProps.location && !this.props.location),
      '<Switch> elements should not change from uncontrolled to controlled (or vice versa). You initially used no "location" prop and then provided one on a subsequent render.'
    )

    warning(
      !(!nextProps.location && this.props.location),
      '<Switch> elements should not change from controlled to uncontrolled (or vice versa). You provided a "location" prop initially but omitted it on a subsequent render.'
    )
  }

  render() {

    const { route } = this.context.router
    const { children, prevContext, loading, nested, transitioning } = this.props
    const location = this.props.location || route.location

    let match, child, prevMatch, prevChild, hasAsyncWork, isAsyncWorkDone;

    React.Children.forEach(children, element => {

      if (!React.isValidElement(element)) return

      const { path: pathProp, exact, strict, from } = element.props
      const path = pathProp || from

      // Only take first match
      if (match == null) {
        child = element
        match = path ? matchPath(location.pathname, { path, exact, strict }) : route.match
      }

      // Find match for the previous context
      if (prevContext && prevContext !== null && prevMatch == null) {
        
        prevChild = element
        prevMatch = path ? matchPath(prevContext.pathname, { path, exact, strict }) : route.match
        console.log('AsyncSwitch/prevMatch', prevMatch)
      }
    })

    // Check if the match has associated async work
    if (match) {
      const { component } = child.props;
      hasAsyncWork = component && component.asyncWork;
      isAsyncWorkDone = component.asyncWorkResolved;
    }

    else {
      return null;
    }

    const args = [{loading, transitioning}, ROUTE_MATCHED, match, child, location, prevMatch, prevChild, prevContext]
    //const getElements = hasAsyncWork && !isAsyncWorkDone && prevContext ? getElementsForAsyncMatch : getElementForMatch
    
    console.log('Stats', hasAsyncWork, isAsyncWorkDone, loading, transitioning)
    
    // This is a nested component, just display it. The location context will be correct.
    if (nested === true) return getElementForMatch.apply(null, args)

    // No Async work involved, process as usual.
    if (!hasAsyncWork) return getElementForMatch.apply(null, args)

    // There is async work but it's already resolved, process as normal.
    if (hasAsyncWork && isAsyncWorkDone) return getElementForMatch.apply(null, args)

    // There's async work but not yet loading, transition just happened.
    if (hasAsyncWork && !loading && transitioning) return getElementsForAsyncMatch.apply(null, args)


    // const getElements = hasAsyncWork && !isAsyncWorkDone && prevContext ? getElementsForAsyncMatch : getElementForMatch

    // Only concerned if App is loading or not
    // const getElements = hasAsyncWork && !isAsyncWorkDone && prevContext ? getElementsForAsyncMatch : getElementForMatch

    // console.log('hasAsyncWork', child && child.props && Object.keys(child.props.component))

    return [getElementsForAsyncMatch.apply(null, args)]
  }
}

function getElementsForAsyncMatch(props, key, match, route, location, prevMatch, prevRoute, prevContext) {
  return <div className="async-switch">{[ 
    getElementForMatch(props, key, match, route, location), 
    getElementForMatch(props, ROUTE_PREV, prevMatch, prevRoute, prevContext)]
  }</div>
}

/*function getElementsForAsyncMatch(key, match, route, location, prevMatch, prevRoute, prevContext) {
  const div = React.createElement("div", {}, [
    <div key={`loading-${key}`} style={{display: 'none'}}>{getElementForMatch(key, match, route, location)}</div>,
    getElementForMatch(ROUTE_PREV, prevMatch, prevRoute, prevContext)
  ])
  return div
}*/

function getElementForMatch(staticContext, key, match, route, location) {
  // if (location.pathname === '/nested-routes/bar') debugger
  return !route ? null : React.cloneElement(route, { staticContext, key, location })
}

export default AsyncSwitch
