'use strict';

import React, { Component } from 'react';
import { Glyphicon } from 'react-bootstrap';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      media: [{}],
      play: false,
    };
  }

  render() {
    return <div style={styles.parent}>
      <div style={{height: '75%', width: '50%'}}>
        <h4>Playlist</h4>
      </div>

      <div style={{height: '75%', width: '50%'}}>
        <h4>Dropzone</h4>
      </div>

      <div style={styles.controlContainer}>
        <div style={styles.controlItems}>
          <Glyphicon glyph='fast-backward' style={styles.icon} />
        </div>

        <div style={styles.controlItems}>
          <Glyphicon glyph='backward' style={styles.icon} />
        </div>

        <div style={styles.controlItems} onClick={() => this.setState({ play: !this.state.play })}>
          <Glyphicon glyph={this.state.play ? 'play' : 'pause'} style={styles.icon} />
        </div>

        <div style={styles.controlItems}>
          <Glyphicon glyph='forward' style={styles.icon} />
        </div>

        <div style={styles.controlItems}>
          <Glyphicon glyph='fast-forward' style={styles.icon} />
        </div>
      </div>
    </div>;
  }
}

const styles = {
  controlContainer: {
    display: 'flex',
    height: '25%',
    width: '100%',
  },

  controlItems: {
    fontSize: 50,
    width: '20%',
  },

  icon: {
    cursor: 'pointer',
    display: 'block',
    textAlign: 'center',
  },

  parent: {
    display: 'flex',
    flexWrap: 'wrap',
    height: '100%',
  },
};