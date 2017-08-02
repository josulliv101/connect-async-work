'use strict';

exports.__esModule = true;
exports.middleware = undefined;

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _store = require('./store');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cancelIds = [];

var ASYNC_DO_WORK = (0, _store.asyncDoWork)().type;

var middleware = exports.middleware = function middleware(store) {
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
        return handleSuccess(work, store, results, next, _store.asyncWorkResolve);
      }, function (error) {
        return handleError(work, store, error, next, _store.asyncWorkError);
      });

      return next(action);
    };
  };
};

function handleSuccess(work, store, results, next, asyncWorkResolve) {

  console.log('middleware/handleSuccess');

  for (var i = 0; i < work.length; i++) {
    // temp fix for issue with axios data structure on server
    // const r = results && results[i] && results[i].status == 200 && results[i].data || results[i]
    next(asyncWorkResolve(work[i].key, results && results.length && results[0]));
  }

  return { work: work, results: results };
}

function handleError(work, store, error, next, asyncWorkError) {

  console.log('middleware/handleError', error);

  if (error.message === 'React Component unmounted before async work resolved.') {
    for (var i = 0; i < work.length; i++) {
      console.log('middleware cancel action', work[i].key);
      next((0, _store.asyncWorkCancel)(work[i].key));
    }
    return;
  }

  for (var _i = 0; _i < work.length; _i++) {
    next(asyncWorkError(work[_i].key, error));
  }
}