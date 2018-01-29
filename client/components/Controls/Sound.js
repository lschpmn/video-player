'use strict';

import React, { Component } from 'react';

export default class Sound extends Component {
  render() {
    return <div style={this.props.style}>
      <i
        className={'fa fa-volume-up'}
        style={styles.icon}
      />
    </div>
  }
}

const styles = {
  icon: {
    cursor: 'pointer',
    display: 'block',
    fontSize: '2rem',
    marginLeft: 10,
    width: '2rem',
  },
};