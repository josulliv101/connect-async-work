import React from 'react';
import { Provider, connect } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { mount, render } from 'enzyme';
import {expect} from 'chai';
import { spy } from 'sinon';

// import module
// import { reducer } from '../modules/store';

describe('<FooBar />', function suite() {
  it('should foobar', function () {
    // const wrapper = shallow(<Avatar/>);
    expect(['foo']).to.have.length(1);
  });
});