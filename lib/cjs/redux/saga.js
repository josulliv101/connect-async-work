'use strict';

exports.__esModule = true;
exports.watchAsyncWork = watchAsyncWork;

var _effects = require('redux-saga/effects');

var _store = require('./store');

var _marked = [asyncWorker, watchAsyncWork].map(regeneratorRuntime.mark);

function asyncWorker(action) {
  var _action$meta, id, work, asyncRender, promises, _ref, _cancelled, results, i;

  return regeneratorRuntime.wrap(function asyncWorker$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:

          console.log('saga action', action);

          // Needs spefici id so that cancelling is specific to this action, not all
          _action$meta = action.meta, id = _action$meta.id, work = _action$meta.work, asyncRender = _action$meta.asyncRender, promises = _action$meta.promises;

          if (work) {
            _context.next = 4;
            break;
          }

          return _context.abrupt('return');

        case 4:
          _context.prev = 4;
          _context.next = 7;
          return (0, _effects.race)({
            results: (0, _effects.all)(promises),
            cancelled: (0, _effects.take)(id)
          });

        case 7:
          _ref = _context.sent;
          _cancelled = _ref.cancelled;
          results = _ref.results;
          _context.next = 12;
          return _cancelled ? (0, _effects.cancel)() : work.map(function (w, i) {
            return (0, _effects.put)((0, _store.asyncWorkResolve)(w.key, results[i]));
          });

        case 12:
          _context.next = 19;
          break;

        case 14:
          _context.prev = 14;
          _context.t0 = _context['catch'](4);

          console.log('catch error', _context.t0);
          _context.next = 19;
          return (0, _effects.put)((0, _store.asyncWorkError)(_context.t0));

        case 19:
          _context.prev = 19;

          console.log('finally');
          _context.next = 23;
          return (0, _effects.cancelled)();

        case 23:
          if (!_context.sent) {
            _context.next = 33;
            break;
          }

          console.log('async work cancelled', work);
          i = 0;

        case 26:
          if (!(i < work.length)) {
            _context.next = 33;
            break;
          }

          console.log('saga cancel action', work[i].key);
          _context.next = 30;
          return (0, _effects.put)((0, _store.asyncWorkCancel)(work[i].key));

        case 30:
          i++;
          _context.next = 26;
          break;

        case 33:
          return _context.finish(19);

        case 34:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked[0], this, [[4, 14, 19, 34]]);
}

function watchAsyncWork() {
  return regeneratorRuntime.wrap(function watchAsyncWork$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return (0, _effects.takeEvery)(_store.asyncDoWork, asyncWorker);

        case 2:
        case 'end':
          return _context2.stop();
      }
    }
  }, _marked[1], this);
}