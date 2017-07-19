import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';

export default class ProviderAsyncWork extends Component {

  static childContextTypes = {
    asyncRender: PropTypes.bool
  }

  getChildContext() {
    return {
      asyncRender: true
    };
  }

  render() {
    let { children } = this.props;
    return Children.only(children);
  }
}
