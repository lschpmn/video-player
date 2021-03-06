import Slider from '@material-ui/core/Slider';
import makeStyles from '@material-ui/core/styles/makeStyles';
import VolumeMute from '@material-ui/icons/VolumeMute';
import VolumeUp from '@material-ui/icons/VolumeUp';
import debounce from 'lodash/debounce';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { setMuted, setVolume } from '../../lib/player-actions';
import { useAction } from '../../lib/utils';
import { ReducerState } from '../../types';

const Sound = () => {
  const [show, setShow] = useState(false);
  const [level, setLevel] = useState(100);
  const setVolumeAction = debounce(useAction(setVolume), 200);
  const setMutedAction = useAction(setMuted);
  const volumeStatus = useSelector((state: ReducerState) => state.chromecastStore?.volumeStatus);
  const classes = useStyles({});

  const onChange = useCallback((e, val: number) => {
    setVolumeAction(val / 100);
    setLevel(val);
  }, []);

  useEffect(() => {
    volumeStatus && setLevel(volumeStatus.level * 100);
  }, [volumeStatus?.level]);

  return <div
    onMouseEnter={() => setShow(true)}
    onMouseLeave={() => setShow(false)}
    style={styles.container}
  >

    {show &&
      <div className={classes.sliderContainer}>
        <Slider
          orientation="vertical"
          onChange={onChange}
          style={styles.slider}
          value={level}
        />
      </div>
    }

    {volumeStatus?.muted
      ? <VolumeMute onClick={() => setMutedAction(false)} style={styles.icon}/>
      : <VolumeUp onClick={() => setMutedAction(true)} style={styles.icon}/>
    }
  </div>;
};

const useStyles = makeStyles(theme => ({
  sliderContainer: {
    backgroundColor: theme.palette.grey.A400,
    bottom: '3rem',
    opacity: 0.8,
    padding: '1rem 1.5rem 0',
    position: 'absolute',
  },
}));

export default Sound;

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'relative',
    width: '3rem',
  } as React.CSSProperties,
  icon: {
    cursor: 'pointer',
    display: 'block',
    fontSize: '2rem',
    margin: '0 auto',
    width: '2rem',
  } as React.CSSProperties,
  slider: {
    height: '5rem',
    padding: 0,
  } as React.CSSProperties,
};
