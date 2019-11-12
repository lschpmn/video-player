import Forward10Icon from '@material-ui/icons/Forward10';
import Pause from '@material-ui/icons/Pause';
import PlayArrow from '@material-ui/icons/PlayArrow';
import Replay10Icon from '@material-ui/icons/Replay10';
import Stop from '@material-ui/icons/Stop';
import Chip from 'material-ui/Chip';
import Slider from 'material-ui/Slider';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { MediaStatus } from '../../../types';
import { changeVolume, pause, play, PLAYING, seek, stopMedia } from '../../lib/player-actions';
import { ReducerState } from '../../types';
import Sound from './Sound';

type State = {
  seekId?: number,
  showTime: boolean,
  x: number,
  val: number,
};

type Props = {
  changeVolume: typeof changeVolume,
  mediaStatus: MediaStatus,
  pause: typeof pause,
  play: typeof play,
  seek: typeof seek,
  stopMedia: typeof stopMedia,
};

class Controls extends Component<Props, State> {
  slider: any;

  state = {
    seekId: null,
    showTime: false,
    x: 0,
    val: 0,
  };

  seek = () => {
    this.setState({showTime: false});
    const { duration } = this.props.mediaStatus;
    this.props.seek(this.state.val * duration);
  };

  render() {
    const { changeVolume, pause, play } = this.props;
    const { currentTime, duration, playerState, volume } = this.props.mediaStatus || {};
    const isMediaLoaded = this.props.mediaStatus;
    const isPlaying = playerState === PLAYING;
    const click = isPlaying ? pause : play;
    const playPercent = currentTime / (duration || 1);

    return <div style={styles.container}>
      <div style={styles.verticalCenter}>
        <div onMouseDown={() => isMediaLoaded && click()}>
          {isPlaying
            ? <Pause style={styles.icon} />
            : <PlayArrow style={styles.icon} />
          }
        </div>
      </div>

      <div style={styles.verticalCenter}>
        <div onMouseDown={() => isMediaLoaded && this.props.stopMedia()}>
          <Stop style={styles.icon} />
        </div>
      </div>

      <div style={styles.verticalCenter}>
        <div onMouseDown={() => isMediaLoaded && this.props.seek(currentTime - 10)}>
          <Replay10Icon style={styles.icon} />
        </div>
      </div>

      <div style={styles.verticalCenter}>
        <div onMouseDown={() => isMediaLoaded && this.props.seek(currentTime + 10)}>
          <Forward10Icon style={styles.icon} />
        </div>
      </div>

      <Sound
        changeVolume={changeVolume}
        volume={volume || {}}
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
          onChange={(e, val) => isMediaLoaded &&  this.setState({ val })}
          onDragStart={() => isMediaLoaded && this.setState({ showTime: true })}
          onDragStop={isMediaLoaded && this.seek}
          //@ts-ignore
          ref={ref => ref && (this.slider = ref.track)}
          sliderStyle={styles.sliderStyle}
          value={playPercent || 0}
        />
      </div>

    </div>
  }
}

function getTimeString(time) {
  if (!time) return '0:00';
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
  (state: ReducerState) => ({
    mediaStatus: state.chromecastStore.mediaStatus,
  }),
  {
    changeVolume,
    stopMedia,
    pause,
    play,
    seek,
  }
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
