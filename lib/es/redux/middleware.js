import invariant from 'invariant';

import { asyncDoWork, asyncWorkInit, asyncWorkResolve, asyncWorkCancel, asyncWorkError } from './store';

var cancelIds = [];

var ASYNC_DO_WORK = asyncDoWork().type;

export var middleware = function middleware(store) {
  return function (next) {
    return function (action) {

      var id = action.meta && action.meta.id;

      if (action.type !== ASYNC_DO_WORK && !cancelIds.includes(action.type)) {
        return next(action);
      }

      var _ref = action.meta || {},
          work = _ref.work,
          asyncRender = _ref.asyncRender,
          promises = _ref.promises,
          callback = _ref.callback,
          RootCmp = _ref.RootCmp;

      if (action.type === ASYNC_DO_WORK && !work) {
        return next(action);
      }

      if (action.type !== ASYNC_DO_WORK) {
        var _promises = action.meta.promises;

        // Call the cancel method attached to any of the promises.

        _promises.forEach(function (p) {
          return p['CANCEL'] && p['CANCEL']();
        });
        return next(action);
      }

      console.log('cancelIds', cancelIds, id);

      // Add the id to the cancel array
      cancelIds = cancelIds.concat([id]);

      Promise.all(promises).then(function (results) {
        return handleSuccess(work, store, results, next, asyncWorkResolve);
      }, function (error) {
        return handleError(work, store, error, next, asyncWorkError);
      });

      return next(action);
    };
  };
};

function handleSuccess(work, store, results, next, asyncWorkResolve) {

  console.log('middleware/handleSuccess');

  for (var i = 0; i < work.length; i++) {
    // temp fix for issue with axios data structure on server
    var r = results && results[i] && results[i].status == 200 && results[i].data || results[i];
    next(asyncWorkResolve(work[i].key, r));
  }

  return { work: work, results: results };
}

function handleError(work, store, error, next, asyncWorkError) {

  console.log('middleware/handleError', error);

  if (error.message === 'React Component unmounted before async work resolved.') {
    for (var i = 0; i < work.length; i++) {
      console.log('middleware cancel action', work[i].key);
      next(asyncWorkCancel(work[i].key));
    }
    return;
  }

  for (var _i = 0; _i < work.length; _i++) {
    next(asyncWorkError(work[_i].key, error));
  }
}