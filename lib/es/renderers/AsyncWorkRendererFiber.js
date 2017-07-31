import React from 'react';
import ReactFiberReconciler from 'react-dom/lib/ReactFiberReconciler';
import ReactBrowserEventEmitter from 'react-dom/lib/ReactBrowserEventEmitter';
import { renderToString as _renderToString, renderToStaticMarkup } from 'react-dom/server';

import Provider from '../components/Provider';

var AsyncWorkRendererFiber = ReactFiberReconciler({
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
    ReactBrowserEventEmitter.setEnabled(false);
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


    var toString = options.static ? renderToStaticMarkup : _renderToString;
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
      return AsyncWorkRendererFiber.updateContainer(React.createElement(
        Provider,
        null,
        element
      ), root, null, null);
    };

    AsyncWorkRendererFiber.performWithPriority(1, update);
    return root.containerInfo.promises[0];
  }
};

export default AsyncWorkRenderer;