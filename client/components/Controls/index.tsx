import Slider from '@material-ui/core/Slider';
import makeStyles from '@material-ui/core/styles/makeStyles';
import useTheme from '@material-ui/core/styles/useTheme';
import Forward10Icon from '@material-ui/icons/Forward10';
import Pause from '@material-ui/icons/Pause';
import PlayArrow from '@material-ui/icons/PlayArrow';
import Replay10Icon from '@material-ui/icons/Replay10';
import Stop from '@material-ui/icons/Stop';
import debounce from 'lodash/debounce';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { pause, play, PLAYING, seek, stopMedia } from '../../lib/player-actions';
import { useAction } from '../../lib/utils';
import { ReducerState } from '../../types';
import Sound from './Sound';

const Controls = () => {
  const [isSeeking, setIsSeeking] = useState(false);
  const [localCurrentTime, setLocalCurrentTime] = useState(0);
  const pauseAction = useAction(pause);
  const playAction = useAction(play);
  const seekAction = useAction(seek);
  const seekDebounce = useCallback(debounce(seekAction, 250), []);
  const stopMediaAction = useAction(stopMedia);
  const mediaStatus = useSelector((state: ReducerState) => state.chromecastStore.mediaStatus);
  const classes = useStyles({});
  const theme = useTheme();
  const { currentTime, duration, playerState } = mediaStatus || {};

  const isMediaLoaded = !!mediaStatus;
  const isPlaying = playerState === PLAYING;
  const click = isPlaying ? pauseAction : playAction;

  useEffect(() => {
    !isSeeking && setLocalCurrentTime(currentTime || 0);
  }, [currentTime]);

  const onSliderChange = useCallback((e, val) => {
    if (val === localCurrentTime) return;
    setLocalCurrentTime(val || 0);
    isMediaLoaded && seekDebounce(val || 0);
  }, [isMediaLoaded]);

  return <div style={{ ...styles.container, backgroundColor: theme.palette.primary.main }}>
    <div style={styles.verticalCenter}>
      <div onMouseDown={() => isMediaLoaded && click()}>
        {isPlaying
          ? <Pause style={styles.icon} />
          : <PlayArrow style={styles.icon} />
        }
      </div>
    </div>

    <div style={styles.verticalCenter}>
      <div onMouseDown={() => isMediaLoaded && stopMediaAction()}>
        <Stop style={styles.icon} />
      </div>
    </div>

    <div style={styles.verticalCenter}>
      <div onMouseDown={() => isMediaLoaded && seekAction(currentTime - 10)}>
        <Replay10Icon style={styles.icon} />
      </div>
    </div>

    <div style={styles.verticalCenter}>
      <div onMouseDown={() => isMediaLoaded && seekAction(currentTime + 10)}>
        <Forward10Icon style={styles.icon} />
      </div>
    </div>

    <Sound />

    <div style={{...styles.verticalCenter, padding: '0 5px'}}>
      {`${getTimeString(localCurrentTime)}/${getTimeString(duration)}`}
    </div>

    <div style={styles.slider} >
      <Slider
        className={classes.slider}
        max={duration || 0}
        min={0}
        onChange={onSliderChange}
        onMouseDown={() => setIsSeeking(true)}
        onMouseUp={() => setIsSeeking(false)}
        style={styles.sliderStyle}
        value={localCurrentTime}
      />
    </div>

  </div>
};

const useStyles = makeStyles(theme => ({
  slider: {
    color: theme.palette.grey.A200,
  },
}));

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

export default Controls;

const styles = {
  chip: {
    bottom: '3rem',
    position: 'fixed',
    width: '4rem',
  } as React.CSSProperties,
  container: {
    alignItems: 'stretch',
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
