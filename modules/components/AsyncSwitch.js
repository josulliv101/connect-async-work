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
    // prevContext: PropTypes.object
  }

  constructor(props) {
      super(props);
      this.state = {
          prevContext: null,
      };
  }
  
  componentDidMount(nextProps) {
    const { route } = this.context.router
    const location = this.props.location || route.location
    if (!this.state.prevContext) {
      this.setState({prevContext: location})
    }
  }

  componentWillReceiveProps(nextProps) {
    
    const { route } = this.context.router
    const location = this.props.location || route.location

    console.log('location', location)
    console.log('prevContext', this.state.prevContext)

    if (location !== this.state.prevContext && this.props.loading) {
      console.log('Switching')
      this.setState({prevContext: location})
    }
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
    const { prevContext } = this.state
    const { children, loading } = this.props
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
      if (prevContext && prevMatch == null) {
        prevChild = element
        prevMatch = path ? matchPath(prevContext.pathname, { path, exact, strict }) : route.match
      }
    })

    // Check if the match has associated async work
    if (match) {
      const { component } = child.props;
      hasAsyncWork = component && component.asyncWork;
      isAsyncWorkDone = hasAsyncWork && !loading
    }

    else {
      return null;
    }

    const args = [ROUTE_MATCHED, match, child, location, prevMatch, prevChild, prevContext]
    //const getElements = hasAsyncWork && !isAsyncWorkDone && prevContext ? getElementsForAsyncMatch : getElementForMatch

    // Only concerned if App is loading or not
    const getElements = loading && prevContext ? getElementsForAsyncMatch : getElementForMatch

    // console.log('hasAsyncWork', child && child.props && Object.keys(child.props.component))

    return getElements.apply(null, args)
  }
}

function getElementsForAsyncMatch(key, match, route, location, prevMatch, prevRoute, prevContext) {
  const div = React.createElement("div", {}, [
    <div key={`loading-${key}`} style={{display: 'none'}}>{getElementForMatch(key, match, route, location)}</div>,
    getElementForMatch(ROUTE_PREV, prevMatch, prevRoute, prevContext)
  ])
  return div
}

function getElementForMatch(key, match, route, location) {
  return React.cloneElement(route, { key, location, computedMatch: match })
}

export default AsyncSwitch
