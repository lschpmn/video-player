import Pause from '@material-ui/icons/Pause';
import PlayArrow from '@material-ui/icons/PlayArrow';
import Chip from 'material-ui/Chip';
import Slider from 'material-ui/Slider';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { changeVolume, pause, PLAY, resume, seek } from '../../lib/player-actions';
import Sound from './Sound';

class Controls extends Component<any, any> {
  slider: any;
  constructor(props) {
    super(props);

    this.state = {
      seekId: null,
      showTime: false,
      x: 0,
      val: 0,
    };

    this.seek = this.seek.bind(this);
  }

  seek() {
    this.setState({showTime: false});
    const { duration } = this.props.status;
    this.props.seek(this.state.val * duration);
  }

  render() {
    const { changeVolume, pause, resume } = this.props;
    const { contentId, currentTime, duration, playerState, volume } = this.props.status;
    const isMediaLoaded = contentId !== '';
    const isPlaying = playerState === PLAY;
    const click = isPlaying ? pause : resume;
    const playPercent = currentTime / (duration || 1);

    return <div style={styles.container}>
      <div style={styles.verticalCenter}>
        <div onMouseDown={() => isMediaLoaded && click()}>
          {isPlaying
            ? <PlayArrow style={styles.icon} />
            : <Pause style={styles.icon} />
          }
        </div>
      </div>

      <Sound
        changeVolume={changeVolume}
        volume={volume}
      />

      <div style={{...styles.verticalCenter, padding: '0 5px'}}>
        {`${getTimeString(currentTime)}/${getTimeString(duration)}`}
      </div>

      <div style={styles.slider} onMouseMove={e => this.state.showTime && this.setState({x: e.pageX})} >
        {this.state.showTime && this.slider &&
          <Chip style={{...styles.chip, left: `calc(${this.state.x}px - 2rem)`}}>
            {getTimeString(this.state.val * duration)}
          </Chip>
        }

        <Slider
          onChange={(e, val) => this.setState({ val })}
          onDragStart={() => this.setState({ showTime: true })}
          onDragStop={this.seek}
          //@ts-ignore
          ref={ref => ref && (this.slider = ref.track)}
          sliderStyle={styles.sliderStyle}
          value={playPercent}
        />
      </div>

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
    changeVolume: changeVolume(dispatch),
    pause: pause(dispatch),
    resume: resume(dispatch),
    seek: seek(dispatch),
  }),
)(Controls);

const styles = {
  chip: {
    bottom: '3rem',
    position: 'fixed',
    width: '4rem',
  } as React.CSSProperties,
  container: {
    alignItems: 'stretch',
    backgroundColor: '#2196F3',
    color: 'white',
    display: 'flex',
    height: '3rem',
    width: '100%',
  } as React.CSSProperties,
  icon: {
    cursor: 'pointer',
    display: 'block',
    fontSize: '2rem',
    marginLeft: 10,
    width: '2rem',
  } as React.CSSProperties,
  slider: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    justifyContent: 'center',
    position: 'relative',
  } as React.CSSProperties,
  sliderStyle: {
    margin: '0 1rem',
    width: 'inherit'
  } as React.CSSProperties,
  verticalCenter: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  } as React.CSSProperties,
};