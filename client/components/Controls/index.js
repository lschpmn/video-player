'use strict';

import React, { Component } from 'react';
import Slider from 'material-ui/Slider';
import { PLAY } from '../../lib/actions';

import './controls-style.css';

export default class Controls extends Component {
  render() {
    const { pause, resume, status } = this.props;
    const isMediaLoaded = status.contentId !== '';
    const isPlaying = status.playerState === PLAY;
    const click = isPlaying ? pause : resume;

    return <div style={styles.container}>
      <div style={styles.verticalCenter}>
        <i
          className={`fa fa-${isPlaying ? 'pause' : 'play'}`}
          onClick={() => isMediaLoaded && click()}
          style={styles.icon}
        />
      </div>

      <Slider className='main-slider' style={styles.slider} />
    </div>
  }
}

const styles = {
  container: {
    alignItems: 'stretch',
    backgroundColor: '#2196F3',
    color: 'white',
    display: 'flex',
    height: '3rem',
    width: '100%',
  },

  icon: {
    cursor: 'pointer',
    display: 'block',
    fontSize: '2rem',
    marginLeft: 10,
    width: '2rem',
  },

  slider: {
    flexGrow: 1,
  },

  verticalCenter: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
};