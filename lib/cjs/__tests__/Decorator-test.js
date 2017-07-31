'use strict';

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _ = require('../');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MockClass = function (_React$Component) {
  _inherits(MockClass, _React$Component);

  function MockClass() {
    _classCallCheck(this, MockClass);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  MockClass.prototype.render = function render() {
    var test = this.props.test;

    return _react2.default.createElement(
      'div',
      null,
      'foo',
      '' + (test ? test : ''),
      ' from mock class'
    );
  };

  return MockClass;
}(_react2.default.Component);

describe('connectAsyncWork', function () {

  describe('Render', function () {

    /*    it('renders the wrapped components render output', () => {
          const node = document.createElement('div')
          const Enhanced = connectAsyncWork()(MockClass)
    
          ReactDOM.render((
            <Enhanced />
          ), node)
    
          expect(node.innerText).toMatch(/foo from mock class/)
        })
    
        it('passes on props to wrapped component', () => {
          const node = document.createElement('div')
          const Enhanced = connectAsyncWork()(MockClass)
    
          ReactDOM.render((
            <Enhanced test="bar" />
          ), node)
    
          expect(node.innerText).toMatch(/foobar from mock class/)
        })*/
  });
});