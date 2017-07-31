'use strict';

var ReactFiberReconciler = require('react-dom/lib/ReactFiberReconciler');
var ReactBrowserEventEmitter = require('react-dom/lib/ReactBrowserEventEmitter');

var promises = [];

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

    console.log('type', type);
    // Removes any lifecycle hooks after componentWillMount
    internalInstanceHandle.firstEffect = null;
    // internalInstanceHandle.nextEffect = null;
    // internalInstanceHandle.lastEffect = null;

    // if (internalInstanceHandle.progressedChild) internalInstanceHandle.progressedChild.firstEffect = null;
    // if (internalInstanceHandle.progressedChild) internalInstanceHandle.progressedChild.nextEffect = null;
    // if (internalInstanceHandle.progressedChild) internalInstanceHandle.progressedChild.lastEffect = null;

    /*    if (internalInstanceHandle.child) internalInstanceHandle.child.firstEffect = null;
        if (internalInstanceHandle.child) internalInstanceHandle.child.nextEffect = null;
        if (internalInstanceHandle.child) internalInstanceHandle.child.lastEffect = null;
    
        if (internalInstanceHandle.sibling) internalInstanceHandle.sibling.firstEffect = null;
        if (internalInstanceHandle.sibling) internalInstanceHandle.sibling.nextEffect = null;
        if (internalInstanceHandle.sibling) internalInstanceHandle.sibling.lastEffect = null;
    
        if (internalInstanceHandle.return) internalInstanceHandle.return.firstEffect = null;
        if (internalInstanceHandle.return) internalInstanceHandle.return.nextEffect = null;
        if (internalInstanceHandle.return) internalInstanceHandle.return.lastEffect = null;
    
        if (internalInstanceHandle.alternate) internalInstanceHandle.alternate.firstEffect = null;
        if (internalInstanceHandle.alternate) internalInstanceHandle.alternate.nextEffect = null;
        if (internalInstanceHandle.alternate) internalInstanceHandle.alternate.lastEffect = null;
    */
    if (props.promise) {
      console.log('promise found', props.promise);
      promises.push(props.promise);
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

var roots = new Map();
var emptyObject = {};
var emptyObjectMain = {};
var defaultContainer = { type: "CONTAINER", children: [] };
var root;

var AsyncWorkRenderer = {
  render: function render(element, options, callback) {

    promises.length = 0;
    root = AsyncWorkRendererFiber.createContainer(Object.assign(defaultContainer, options));

    var fooFn = function fooFn() {
      return AsyncWorkRendererFiber.updateContainer(element, root, null, null);
    };

    AsyncWorkRendererFiber.performWithPriority(1, fooFn);

    return { promises: Promise.all(promises), total: promises.length };
  }
};

module.exports = AsyncWorkRenderer;