'use strict';

import React, { Component } from 'react';
import { Glyphicon } from 'react-bootstrap';

export default class Controls extends Component {
  render() {
    const { changePlay, play } = this.props;

    return <div style={styles.container}>
      <div style={styles.controlItems}>
        <Glyphicon glyph='fast-backward' style={styles.icon} />
      </div>

      <div style={styles.controlItems}>
        <Glyphicon glyph='backward' style={styles.icon} />
      </div>

      <div style={styles.controlItems} onClick={() => changePlay(!play)}>
        <Glyphicon glyph={play ? 'pause' : 'play'} style={styles.icon} />
      </div>

      <div style={styles.controlItems}>
        <Glyphicon glyph='forward' style={styles.icon} />
      </div>

      <div style={styles.controlItems}>
        <Glyphicon glyph='fast-forward' style={styles.icon} />
      </div>
    </div>
  }
}

const styles = {
  container: {
    display: 'flex',
    height: '25%',
    width: '100%',
  },

  controlItems: {
    fontSize: '15vh',
    width: '20%',
  },

  icon: {
    cursor: 'pointer',
    display: 'block',
    textAlign: 'center',
  },
};