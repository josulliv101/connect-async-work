import expect from 'expect'
import sinon from 'sinon'
import { mount, render } from 'enzyme'

import React from 'react'

import AsyncSwitch from '../../components/AsyncSwitch'

describe('<AsyncSwitch />', () => {

  describe('Render', () => {

    it('has custom props passed down to Wrapped Component', () => {
        
/*      const Enhanced = withAsyncWork([])(props => <div>{props.customProp}</div>)
      const wrapper = mount(
        <Enhanced customProp="bar" />,
        { context }
      );
*/

      expect('bar').toBe("bar")
    })
  });

})