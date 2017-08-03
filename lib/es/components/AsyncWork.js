function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import PropTypes from 'prop-types';
import invariant from 'invariant';

import { asyncDoWork, asyncWorkCancel } from '../redux/store';

var AsyncWork = function (_React$Component) {
  _inherits(AsyncWork, _React$Component);

  function AsyncWork(props, context) {
    _classCallCheck(this, AsyncWork);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props, context));

    var dispatch = props.dispatch,
        doWorkCalled = props.doWorkCalled,
        workItems = props.workItems,
        rootCmp = props.rootCmp;


    var promises = void 0;

    // This info maps to redux store
    if (doWorkCalled === true) return _possibleConstructorReturn(_this);

    promises = workItems.map(function (item) {
      return item.work();
    });

    _this.action = asyncDoWork(workItems, promises, false);
    _this.workPromises = _this.action.meta.promises;
    dispatch(_this.action);
    _this.cancelDoWork = _this.action.meta.cancel;
    return _this;
  }

  AsyncWork.prototype.componentWillUnmount = function componentWillUnmount() {
    var _props = this.props,
        dispatch = _props.dispatch,
        loaded = _props.loaded;

    // No need to cancel if everything is loaded.

    if (loaded === true) return;

    if (this.cancelDoWork) {
      dispatch(this.cancelDoWork());
    }
  };

  AsyncWork.prototype.render = function render() {
    var children = this.props.children;

    return children ? React.Children.only(children) : null;
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
AsyncWork.defaultProps = {
  workItems: []
};


export default AsyncWork;