import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CastIcon from '@material-ui/icons/Cast';
import CastConnectedIcon from '@material-ui/icons/CastConnected';
import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { connect, getChromecasts, getMediaStatus, launch, PLAYING } from '../../lib/player-actions';
import { useAction } from '../../lib/utils';
import { ReducerState } from '../../types';

const Media = () => {
  const connectAction = useAction(connect);
  const getChromecastsAction = useAction(getChromecasts);
  const getMediaStatusAction = useAction(getMediaStatus);
  const launchAction = useAction(launch);
  const chromecastStore = useSelector((state: ReducerState) => state.chromecastStore);
  const [showUrlField, setShowUrlField] = useState(false);
  const [url, setUrl] = useState('');
  const name = chromecastStore.chromecasts[0] && chromecastStore.chromecasts[0].name;

  const onEnter = useCallback(({ key }) => {
    if (key === 'Enter') {
      launchAction(url, true);
      setShowUrlField(false);
      setUrl('');
    }
  } ,[url]);

  useEffect(() => {
    getChromecastsAction();
  }, []);

  useEffect(() => {
    if (chromecastStore.chromecasts[0] && !chromecastStore.loading && !chromecastStore.isConnected) {
      setTimeout(() => connectAction(chromecastStore.chromecasts[0].host), 500);
    }
  }, [chromecastStore.chromecasts[0], chromecastStore.loading, chromecastStore.isConnected]);

  useEffect(() => {
    if (showUrlField) {
      document.addEventListener('keydown', onEnter);
      return () => document.removeEventListener('keydown', onEnter);
    }
  }, [showUrlField, url]);

  useEffect(() => {
    const isPlaying = chromecastStore.mediaStatus?.playerState === PLAYING;
    const intervalId = setInterval(() => getMediaStatusAction(), isPlaying ? 1000 : 5000);

    return () => clearInterval(intervalId);
  }, [chromecastStore.mediaStatus?.playerState]);

  return <div style={styles.container}>
    {chromecastStore.isConnected
      ? chromecastStore.mediaStatus
        ? <CastConnectedIcon color="primary" style={styles.icon}/>
        : <CastIcon color="secondary" style={styles.icon}/>
      : <CastIcon color="error" style={styles.icon}/>}

    <div style={styles.name}>{name}</div>
    <div style={styles.name}>{chromecastStore.mediaStatus?.title}</div>
    <div style={styles.name}>{chromecastStore.mediaStatus?.subtitle}</div>

    <div style={{ flex: 1 }}/>

    {showUrlField
      ? <TextField
        label="URL"
        onBlur={() => setShowUrlField(false)}
        onChange={e => setUrl(e.target.value)}
        style={styles.urlInput}
        variant="filled"
        value={url}
      />
      : <Button
        onMouseDown={() => setShowUrlField(true)}
        style={styles.urlInput}
        variant="contained"
      >
        Add URL
      </Button>
    }
  </div>;
};

export default Media;

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    wordBreak: 'break-all',
  } as React.CSSProperties,
  name: {
    textAlign: 'center',
    padding: '0.5rem',
  } as React.CSSProperties,
  icon: {
    cursor: 'pointer',
    display: 'block',
    fontSize: '2rem',
    margin: '0 auto',
    padding: '0.5rem 0',
    width: '2rem',
  } as React.CSSProperties,
  urlInput: {
    height: '3rem',
    margin: '2rem 0',
  } as React.CSSProperties,
};
