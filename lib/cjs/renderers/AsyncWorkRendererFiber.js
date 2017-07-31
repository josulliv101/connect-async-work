'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ReactFiberReconciler = require('react-dom/lib/ReactFiberReconciler');

var _ReactFiberReconciler2 = _interopRequireDefault(_ReactFiberReconciler);

var _ReactBrowserEventEmitter = require('react-dom/lib/ReactBrowserEventEmitter');

var _ReactBrowserEventEmitter2 = _interopRequireDefault(_ReactBrowserEventEmitter);

var _server = require('react-dom/server');

var _Provider = require('../components/Provider');

var _Provider2 = _interopRequireDefault(_Provider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AsyncWorkRendererFiber = (0, _ReactFiberReconciler2.default)({
  getRootHostContext: function getRootHostContext(context) {
    return emptyObject;
  },
  getChildHostContext: function getChildHostContext(context, type, rootInstance) {
    return emptyObject;
  },
  getPublicInstance: function getPublicInstance(instance) {

    if (instance == null) {
      return null;
    }

    return instance != null && instance;
  },
  createInstance: function createInstance(type, props, rootContainerInstance, hostContext, internalInstanceHandle) {

    // Removes any lifecycle hooks after componentWillMount.
    // Since this is only experimental, I'll do something like this.
    internalInstanceHandle.firstEffect = null;

    if (props.promise) {
      // This single promise represents when all work item promises are resolved (for a specific cmp)
      rootContainerInstance.promises.push(props.promise);
    }
    return null;
  },
  finalizeInitialChildren: function finalizeInitialChildren(host, type, props, arg4, arg5) {
    return false;
  },
  prepareUpdate: function prepareUpdate(instance, type, oldProps, newProps, finishedWork) {
    return null;
  },
  commitMount: function commitMount(instance, type, newProps, finishedWork) {},
  commitUpdate: function commitUpdate(instance, updatePayload, type, oldProps, newProps, finishedWork) {},
  shouldSetTextContent: function shouldSetTextContent(type, props) {
    return false;
  },
  resetTextContent: function resetTextContent(instance) {},
  createTextInstance: function createTextInstance(text, rootContainerInstance, hostContext, internalInstanceHandle) {
    return null;
  },
  commitTextUpdate: function commitTextUpdate(textInstance, oldText, newText) {},
  appendInitialChild: function appendInitialChild(parentInstance, child, finishedWork) {
    return null;
  },
  appendChild: function appendChild(parentInstance, child, finishedWork) {

    var index = parentInstance.children.indexOf(child);

    if (index !== -1) {
      parentInstance.children.splice(index, 1);
    }

    parentInstance.children.push(child);
  },
  insertBefore: function insertBefore(parentInstance, child, beforeChild) {},
  insertInContainerBefore: function insertInContainerBefore(container, child, beforeChild) {},
  removeChild: function removeChild(parentInstance, child) {},
  removeChildFromContainer: function removeChildFromContainer(container, child) {},
  prepareForCommit: function prepareForCommit(arg1) {
    _ReactBrowserEventEmitter2.default.setEnabled(false);
  },
  resetAfterCommit: function resetAfterCommit() {},


  /*  shouldDeprioritizeSubtree(type, props) {
      console.log('shouldDeprioritizeSubtree');
      debugger
      props.hidden === true;
    },*/
  // scheduleAnimationCallback: process.nextTick,

  scheduleDeferredCallback: function scheduleDeferredCallback(fn) {
    return;
  }, // setTimeout(fn, 4, {timeRemaining() { return 4; }}),

  useSyncScheduling: false
});

var emptyObject = {};

var AsyncWorkRenderer = {
  renderToString: function renderToString(element) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var callback = arguments[2];


    var toString = options.static ? _server.renderToStaticMarkup : _server.renderToString;
    var promises = AsyncWorkRenderer.renderToPromises(element) || [];

    // return new Promise((resolve, reject) => {
    return Promise.all(promises).then(function () {
      return toString(element);
    });
    // })
  },
  renderToPromises: function renderToPromises(element) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var callback = arguments[2];


    var defaultContainer = { type: "CONTAINER", promises: [], children: [] };

    var root = AsyncWorkRendererFiber.createContainer(Object.assign(defaultContainer, options));

    // Provider adds 'asyncRender' flag to context
    var update = function update() {
      return AsyncWorkRendererFiber.updateContainer(_react2.default.createElement(
        _Provider2.default,
        null,
        element
      ), root, null, null);
    };

    AsyncWorkRendererFiber.performWithPriority(1, update);
    return root.containerInfo.promises[0];
  }
};

exports.default = AsyncWorkRenderer;