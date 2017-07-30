'use strict';

import React, { Component } from 'react';
import { Glyphicon } from 'react-bootstrap';

export default class App extends Component {
  render() {
    return <div style={styles.parent}>
      <div style={{width: '50%'}}>
        <h4>Playlist</h4>
      </div>

      <div style={{width: '50%'}}>
        <h4>Dropzone</h4>
      </div>

      <div style={styles.controlContainer}>
        <div style={styles.controlItems}>
          previous
        </div>

        <div style={styles.controlItems}>
          skip back
        </div>

        <div style={{...styles.controlItems, fontSize: 50}}>
          <Glyphicon glyph='play' />
        </div>

        <div style={styles.controlItems}>
          skip forward
        </div>

        <div style={styles.controlItems}>
          next
        </div>
      </div>
    </div>;
  }
}

const styles = {
  parent: {
    display: 'flex',
    flexWrap: 'wrap',
    height: '100%',
  },

  controlContainer: {
    display: 'flex',
    width: '100%',
  },

  controlItems: {
    fontSize: 30,
    width: '20%',
  },
};