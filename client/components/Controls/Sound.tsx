import VolumeUp from '@material-ui/icons/VolumeUp';
import VolumeMute from '@material-ui/icons/VolumeMute';
import debounce from 'lodash/debounce';
import Slider from 'material-ui/Slider';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { setMuted, setVolume } from '../../lib/player-actions';
import { useAction } from '../../lib/utils';
import { ReducerState } from '../../types';

const Sound = () => {
  const [show, setShow] = useState(false);
  const setVolumeAction = debounce(useAction(setVolume), 200);
  const setMutedAction = useAction(setMuted);
  const volumeStatus = useSelector((state: ReducerState) => state.chromecastStore?.volumeStatus);

  return <div
    onMouseEnter={() => setShow(true)}
    onMouseLeave={() => setShow(false)}
    style={styles.container}
  >

    {show &&
      <Slider
        axis={'y'}
        onChange={(e, val) => setVolumeAction(val)}
        style={styles.slider}
        sliderStyle={{ marginTop: '1rem' }}
        value={volumeStatus?.level}
      />
    }

    {volumeStatus?.muted
      ? <VolumeMute onClick={() => setMutedAction(false)} style={styles.icon}/>
      : <VolumeUp onClick={() => setMutedAction(true)} style={styles.icon}/>
    }
  </div>;
};

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
    backgroundColor: 'black',
    bottom: '3rem',
    height: '5rem',
    left: '1rem',
    opacity: 0.6,
    paddingBottom: '1rem',
    position: 'absolute',
  } as React.CSSProperties,
};
