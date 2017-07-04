import expect from 'expect'
import React from 'react'
import ReactDOM from 'react-dom'
import sinon from 'sinon'

import { connectAsyncWork } from '../'


class MockClass extends React.Component {
  render() {
    const { test } = this.props;
    return (
      <div>foo{`${test ? test : ''}`} from mock class</div>
    )
  }
}

describe('connectAsyncWork', () => {

  describe('Render', () => {

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
})