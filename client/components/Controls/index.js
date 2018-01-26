'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from 'material-ui/Slider';
import { pause, PLAY, resume, seek } from '../../lib/actions';

import './controls-style.css';

class Controls extends Component {
  render() {
    const { pause, resume, status, seek } = this.props;
    const isMediaLoaded = status.contentId !== '';
    const isPlaying = status.playerState === PLAY;
    const click = isPlaying ? pause : resume;
    const playPercent = status.currentTime / (status.duration || 1);

    return <div style={styles.container}>
      <div style={styles.verticalCenter}>
        <i
          className={`fa fa-${isPlaying ? 'pause' : 'play'}`}
          onClick={() => isMediaLoaded && click()}
          style={styles.icon}
        />
      </div>

      <Slider className='main-slider' style={styles.slider} value={playPercent} onChange={(e, val) => seek(val * status.duration)} />
    </div>
  }
}

export default connect(
  state => state,
  dispatch => ({
    pause: pause(dispatch),
    resume: resume(dispatch),
    seek: seek(dispatch),
  }),
)(Controls);

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