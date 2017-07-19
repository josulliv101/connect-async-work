import React from 'react'
import ReactFiberReconciler from 'react-dom/lib/ReactFiberReconciler'
import ReactBrowserEventEmitter from 'react-dom/lib/ReactBrowserEventEmitter'
import { renderToString, renderToStaticMarkup } from 'react-dom/server';

import Provider from '../components/Provider';

const AsyncWorkRendererFiber = ReactFiberReconciler({
  getRootHostContext(context) {
    return emptyObject;
  },

  getChildHostContext(context, type, rootInstance) {
    return emptyObject
  },

  getPublicInstance(instance) {

    if (instance == null) {
      return null;
    }

    return instance != null && instance;
  },

  createInstance(type, props, rootContainerInstance, hostContext, internalInstanceHandle) {

    // Removes any lifecycle hooks after componentWillMount.
    // Since this is only experimental, I'll do something like this.
    internalInstanceHandle.firstEffect = null;

    if (props.promise) {
      // This single promise represents when all work item promises are resolved (for a specific cmp)
      rootContainerInstance.promises.push(props.promise)
    }
    return null;
  },

  finalizeInitialChildren(host, type, props, arg4, arg5) {
    return false;
  },

  prepareUpdate(instance, type, oldProps, newProps, finishedWork) {
    return null;
  },

  commitMount(instance, type, newProps, finishedWork) {
  },

  commitUpdate(instance, updatePayload, type, oldProps, newProps, finishedWork) {

  },

  shouldSetTextContent(type, props) {
    return false
  },

  resetTextContent(instance) {
  },

  createTextInstance(text, rootContainerInstance, hostContext, internalInstanceHandle) {
    return null;
  },

  commitTextUpdate(textInstance, oldText, newText) {

  },
  appendInitialChild(parentInstance, child, finishedWork) {
    return null;
  },
  appendChild(parentInstance, child, finishedWork) {

    const index = parentInstance.children.indexOf(child);

    if (index !== -1) {
      parentInstance.children.splice(index, 1);
    }

    parentInstance.children.push(child);
  },

  insertBefore(parentInstance, child, beforeChild) {
  },
  insertInContainerBefore(container, child, beforeChild) {
  },

  removeChild(parentInstance, child) {
  },
  removeChildFromContainer(container, child) {
  },

  prepareForCommit(arg1) {
    ReactBrowserEventEmitter.setEnabled(false);
  },

  resetAfterCommit() {
  },

/*  shouldDeprioritizeSubtree(type, props) {
    console.log('shouldDeprioritizeSubtree');
    debugger
    props.hidden === true;
  },*/
  // scheduleAnimationCallback: process.nextTick,

  scheduleDeferredCallback: (fn) => {
    return;
  }, // setTimeout(fn, 4, {timeRemaining() { return 4; }}),

  useSyncScheduling: false,
});

const emptyObject = {};
const defaultContainer = { type: "CONTAINER", promises: [], children: [] };
const AsyncWorkRenderer = {
  
  renderToString(element, options = {}, callback) {

    const toString = options.static ? renderToStaticMarkup : renderToString;
    const promises = AsyncWorkRenderer.renderToPromises(element)
    
    return new Promise((resolve, reject) => {
      return Promise.all(promises).then(() => resolve(toString(element)))
    })

  },
  renderToPromises(element, options = {}, callback) {

    const root = AsyncWorkRendererFiber.createContainer(
      Object.assign(defaultContainer, options)
    );
    
    // Provider adds 'asyncRender' flag to context
    const update = () => AsyncWorkRendererFiber.updateContainer(<Provider>{element}</Provider>, root, null, null)

    AsyncWorkRendererFiber.performWithPriority(1, update);
    return root.containerInfo.promises

  },
};

export default AsyncWorkRenderer;
