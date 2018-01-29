'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from 'material-ui/Slider';
import { pause, PLAY, resume, seek } from '../../lib/actions';
import Sound from './Sound';

import './controls-style.css';

class Controls extends Component {
  constructor(props) {
    super(props);

    this.state = {
      seekId: null,
    };

    this.seek = this.seek.bind(this);
  }

  seek(e, val) {
    if (this.state.seekId) clearTimeout(this.state.seekId);
    const { duration } = this.props.status;

    const seekId = setTimeout(() => this.props.seek(val * duration), 250);

    this.setState({
      seekId,
    });
  }

  render() {
    const { pause, resume } = this.props;
    const { contentId, currentTime, duration, playerState, volume } = this.props.status;
    const isMediaLoaded = contentId !== '';
    const isPlaying = playerState === PLAY;
    const click = isPlaying ? pause : resume;
    const playPercent = currentTime / (duration || 1);

    return <div style={styles.container}>
      <div style={styles.verticalCenter}>
        <i
          className={`fa fa-${isPlaying ? 'pause' : 'play'}`}
          onClick={() => isMediaLoaded && click()}
          style={styles.icon}
        />
      </div>

      <Sound
        style={{...styles.verticalCenter, padding: '0 5px'}}
        volume={volume}
      />

      <div style={{...styles.verticalCenter, padding: '0 5px'}}>
        {`${getTimeString(currentTime)}/${getTimeString(duration)}`}
      </div>

      <Slider
        className='main-slider'
        onChange={this.seek}
        style={styles.slider}
        value={playPercent}
      />
    </div>
  }
}

function getTimeString(time) {
  let currentTime = Math.round(time);
  let hour;
  let min;
  let sec;

  sec = currentTime % 60;
  currentTime -= sec;

  min = (currentTime % 3600) / 60;
  currentTime -= min * 60;

  hour = Math.round(currentTime / 3600);

  return `${hour ? hour + ':' : ''}${leadZero(min)}:${leadZero(sec)}`;
}

function leadZero(num) {
  return ('0' + num).slice(-2);
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