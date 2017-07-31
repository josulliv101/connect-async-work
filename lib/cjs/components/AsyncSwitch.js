'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _reactRouter = require('react-router');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ROUTE_MATCHED = 'route_matched';
var ROUTE_PREV = 'route_prev';

/**
 * The public API for rendering the first <Route> that matches.
 */

var AsyncSwitch = function (_React$Component) {
  _inherits(AsyncSwitch, _React$Component);

  function AsyncSwitch(props, context) {
    _classCallCheck(this, AsyncSwitch);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props, context));

    _this.state = {
      workType: null, // static | async
      workStatus: null, // done | pending
      resolvedLocations: [context.router.route.location], // If a user clicks away before async work is done, the location is not resolved.
      prevLocation: context.router.route.location
    };
    return _this;
  }
  /*  componentDidMount() {
      const {history} = this.context.router
      this.unlisten = history.listen(this.handleHistoryChange)
    }
  
    handleHistoryChange = (location, action) => {
  
      const {history, route} = this.context.router
  
      if (action === 'PUSH') {
        console.log("AsyncSwitch REROUTE with REPLACE", this.props.loading)
        history.replace(location.pathname, {asyncWorkResolved: false})
      }
  
      // We need to know if a item in the history has finished loading any async work.
      // If a route gets cancelled (i.e. the user clicks away before async work loads)
      // the last item in history with fully loaded async work is needed as prevContext
  
    }*/


  AsyncSwitch.prototype.getPrevLocation = function getPrevLocation() {
    return this.state.resolvedLocations[this.state.resolvedLocations.length - 1];
  };

  AsyncSwitch.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps, nextContext) {
    var location = this.context.router.route.location;
    var nextLocation = nextContext.router.route.location;
    var _state = this.state,
        prevLocation = _state.prevLocation,
        resolvedLocations = _state.resolvedLocations;

    // Ignore the transition itself. This is the render where any async work is discovered (if any)

    if (location !== nextLocation) {
      this.setState({ prevLocation: location });
      return;
    }

    // Async work found, it's still in progress
    if (nextProps.loading === true && this.props.loading === false) {
      return this.setState({ workStatus: 'pending', workType: 'async' });
    }

    // Since all async work is resolved, can now added as last forcedLocation.
    // Important when a user clicks around quickly, cancelling async work.
    else if (nextProps.loading === false && this.props.loading === true) {
        return this.setState({
          workStatus: 'done',
          resolvedLocations: resolvedLocations.concat(prevLocation)
        });
      } else if (nextProps.loading === true && this.props.loading === true) {
        return; // Async work still going on
      }

    // If we ever get here, we know we're dealing with no async work
    this.setState({
      workStatus: 'done',
      workType: 'static',
      resolvedLocations: resolvedLocations.concat(prevLocation)
    });
  };

  AsyncSwitch.prototype.componentDidUpdate = function componentDidUpdate(prevProps, prevState) {};

  AsyncSwitch.prototype.render = function render() {
    var route = this.context.router.route;
    var _props = this.props,
        children = _props.children,
        loading = _props.loading,
        nested = _props.nested,
        transitioning = _props.transitioning;

    var location = this.props.location || route.location;

    var prevContext = this.getPrevLocation();

    var match = void 0,
        child = void 0,
        prevMatch = void 0,
        prevChild = void 0,
        hasAsyncWork = void 0,
        isAsyncWorkDone = void 0;
    console.log('prevContext', prevContext);
    _react2.default.Children.forEach(children, function (element) {

      if (!_react2.default.isValidElement(element)) return;

      var _element$props = element.props,
          pathProp = _element$props.path,
          exact = _element$props.exact,
          strict = _element$props.strict,
          from = _element$props.from;

      var path = pathProp || from;

      // Only take first match
      if (match == null) {
        child = element;
        match = path ? (0, _reactRouter.matchPath)(location.pathname, { path: path, exact: exact, strict: strict }) : route.match;
      }

      // Find match for the previous context
      if (prevContext && prevContext !== null && prevMatch == null) {

        prevChild = element;
        prevMatch = path ? (0, _reactRouter.matchPath)(prevContext.pathname, { path: path, exact: exact, strict: strict }) : route.match;
        console.log('AsyncSwitch/prevMatch', prevMatch);
      }
    });

    // Check if the match has associated async work
    if (match) {
      var component = child.props.component;

      hasAsyncWork = component && component.asyncWork;
      isAsyncWorkDone = component.asyncWorkResolvedSuccess;
    } else {
      return null;
    }

    var args = [{ loading: loading, transitioning: transitioning }, ROUTE_MATCHED, match, child, location, prevMatch, prevChild, prevContext];
    //const getElements = hasAsyncWork && !isAsyncWorkDone && prevContext ? getElementsForAsyncMatch : getElementForMatch

    console.log('Stats', hasAsyncWork, isAsyncWorkDone, loading, transitioning);

    // This is a nested component, just display it. The location context will be correct.
    // if (nested === true) return getElementForMatch.apply(null, args)

    // No Async work involved, process as usual.
    if (!hasAsyncWork) return getElementForMatch.apply(null, args);

    // There is async work but it's already resolved, process as normal.
    if (hasAsyncWork && isAsyncWorkDone) return getElementForMatch.apply(null, args);

    // There's async work but not yet loading, transition just happened.
    if (hasAsyncWork && !loading && transitioning) return getElementsForAsyncMatch.apply(null, args);

    // const getElements = hasAsyncWork && !isAsyncWorkDone && prevContext ? getElementsForAsyncMatch : getElementForMatch

    // Only concerned if App is loading or not
    // const getElements = hasAsyncWork && !isAsyncWorkDone && prevContext ? getElementsForAsyncMatch : getElementForMatch

    // console.log('hasAsyncWork', child && child.props && Object.keys(child.props.component))

    return [getElementsForAsyncMatch.apply(null, args)];
  };

  return AsyncSwitch;
}(_react2.default.Component);

AsyncSwitch.contextTypes = {
  router: _propTypes2.default.shape({
    route: _propTypes2.default.object.isRequired
  }).isRequired
};
AsyncSwitch.propTypes = {
  children: _propTypes2.default.node,
  location: _propTypes2.default.object,
  prevContext: _propTypes2.default.object
};


function getElementsForAsyncMatch(props, key, match, route, location, prevMatch, prevRoute, prevContext) {
  return _react2.default.createElement(
    'div',
    { className: 'async-switch' },
    [getElementForMatch(props, key, match, route, location), getElementForMatch(props, ROUTE_PREV, prevMatch, prevRoute, prevContext)]
  );
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
  return !route ? null : _react2.default.cloneElement(route, { staticContext: staticContext, key: key, location: location });
}

exports.default = AsyncSwitch;