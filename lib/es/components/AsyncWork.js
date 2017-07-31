function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import PropTypes from 'prop-types';
import invariant from 'invariant';

import { asyncDoWork, asyncWorkCancel } from '../store';

var AsyncWork = function (_React$Component) {
  _inherits(AsyncWork, _React$Component);

  function AsyncWork(props, context) {
    _classCallCheck(this, AsyncWork);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props, context));

    console.log('AsyncWork / constructor');
    var dispatch = props.dispatch,
        doWorkCalled = props.doWorkCalled,
        workItems = props.workItems,
        rootCmp = props.rootCmp;
    var asyncRender = context.asyncRender;

    var promises = void 0;

    // This info maps to redux store
    if (doWorkCalled === true) return _possibleConstructorReturn(_this);

    promises = workItems.map(function (item) {
      return item.work();
    });

    _this.action = asyncDoWork(workItems, promises, asyncRender);
    _this.workPromises = _this.action.meta.promises;

    console.log('AsyncWork / constructor / DISPATCH ACTION');
    // Can return promise here from dispatch via middleware
    // if (asyncRender !== true) {
    dispatch(_this.action);
    _this.cancelDoWork = _this.action.meta.cancel;
    // }
    return _this;
  }

  AsyncWork.prototype.componentWillUnmount = function componentWillUnmount() {
    var _props = this.props,
        dispatch = _props.dispatch,
        loaded = _props.loaded;


    console.log('AsyncWork componentWillUnmount - all loaded %s', loaded);

    // No need to cancel if everything is loaded.
    if (loaded === true) return;

    if (this.cancelDoWork) {
      dispatch(this.cancelDoWork());
    }
  };

  AsyncWork.prototype.render = function render() {
    console.log('AsyncWork / render', this.context.asyncRender);
    // The propsToPass will contain the appropriate key for each item of
    // work... provided by the HOC which connects to the store

    var _props2 = this.props,
        children = _props2.children,
        workItems = _props2.workItems,
        propsToPass = _objectWithoutProperties(_props2, ['children', 'workItems']);

    // The child is the wrapped component - already with neeeded props via HOC


    var ChildComponent = children ? React.Children.only(children) : null;

    // The `is` prop avoids a warning about needing lowercase elements.
    var elementProps = { is: 'AsyncWork', promise: this.workPromises };

    // Wrap the ChildComponent in an AsyncWork tag when doing async render.
    // This gives the renderer access to the promise object on the instance.
    // Without this custom element, renderer converts all to html tags 
    // which cannot have a custom props like a promise.
    // Better way to accomplish this?
    // console.log('ChildComponent', ChildComponent)
    if (this.context.asyncRender) {
      return React.createElement('AsyncWork', elementProps, [ChildComponent]);
    }
    return ChildComponent;
  };

  return AsyncWork;
}(React.Component);

AsyncWork.propTypes = {
  children: PropTypes.node,
  doWorkCalled: PropTypes.bool,
  keys: PropTypes.arrayOf(PropTypes.string),
  loading: PropTypes.bool, // True if any async work is unresolved for each component
  workItems: PropTypes.arrayOf(PropTypes.object)
};
AsyncWork.contextTypes = {
  asyncRender: PropTypes.bool
};
AsyncWork.defaultProps = {
  workItems: []
};


export default AsyncWork;