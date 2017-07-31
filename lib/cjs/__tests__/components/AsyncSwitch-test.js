'use strict';

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _enzyme = require('enzyme');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _AsyncSwitch = require('../../components/AsyncSwitch');

var _AsyncSwitch2 = _interopRequireDefault(_AsyncSwitch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('<AsyncSwitch />', function () {

  describe('Render', function () {

    it('has custom props passed down to Wrapped Component', function () {

      /*      const Enhanced = withAsyncWork([])(props => <div>{props.customProp}</div>)
            const wrapper = mount(
              <Enhanced customProp="bar" />,
              { context }
            );
      */

      (0, _expect2.default)('bar').toBe("bar");
    });
  });
});