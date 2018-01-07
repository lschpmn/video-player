'use strict';

import React, { Component } from 'react';
import { Glyphicon } from 'react-bootstrap';

export default class Controls extends Component {
  render() {
    const { changePlay, play } = this.props;

    return <div style={styles.container}>
      <Glyphicon glyph={play ? 'pause' : 'play'} style={styles.icon} onClick={() => changePlay(!play)} />
    </div>
  }
}

const styles = {
  container: {
    backgroundColor: '#2196F3',
    color: 'white',
    display: 'flex',
    height: '100%',
    width: '100%',
  },

  icon: {
    cursor: 'pointer',
    display: 'block',
    fontSize: '9vh',
    textAlign: 'center',
    top: 0,
  },
};