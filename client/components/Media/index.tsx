import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import isEqual from 'lodash/isEqual';
import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { connect, getChromecasts, getMediaStatus, launch, PLAYING, updateHistory } from '../../lib/player-actions';
import { useAction } from '../../lib/utils';
import { ReducerState } from '../../types';
import { ChromecastIcon } from './ChromecastIcon';

const PAUSED_STATUS_INTERVAL = 5000;
const PLAYING_STATUS_INTERVAL = 1000;
const UPDATE_INTERVAL = 3;

const Media = () => {
  const connectAction = useAction(connect);
  const getChromecastsAction = useAction(getChromecasts);
  const getMediaStatusAction = useAction(getMediaStatus);
  const launchAction = useAction(launch);
  const updateHistoryAction = useAction(updateHistory);
  const chromecastStore = useSelector((state: ReducerState) => state.chromecastStore, isEqual);
  const [lastUpdate, setLastUpdate] = useState(0);
  const [showUrlField, setShowUrlField] = useState(false);
  const [url, setUrl] = useState('');

  const onEnter = useCallback(({ key }) => {
    if (key === 'Enter') {
      launchAction(url, true);
      setShowUrlField(false);
      setUrl('');
    }
  }, [url]);

  useEffect(() => {
    getChromecastsAction();
  }, []);

  useEffect(() => {
    if (chromecastStore.chromecasts[0] && !chromecastStore.loading && !chromecastStore.isConnected) {
      setTimeout(() => connectAction(chromecastStore.chromecasts[0]), 500);
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
    const intervalId = setInterval(() =>
      getMediaStatusAction(), isPlaying ? PLAYING_STATUS_INTERVAL : PAUSED_STATUS_INTERVAL);

    return () => clearInterval(intervalId);
  }, [chromecastStore.mediaStatus?.playerState]);

  useEffect(() => {
    const isPlaying = chromecastStore.mediaStatus?.playerState === PLAYING;
    if (isPlaying) {
      const currentTime = chromecastStore.mediaStatus.currentTime;
      if (Math.abs(currentTime - lastUpdate) > UPDATE_INTERVAL) {
        setLastUpdate(currentTime);
        updateHistoryAction(chromecastStore.mediaStatus.title, ~~currentTime);
        console.log(~~currentTime);
      }
    }
  }, [chromecastStore.mediaStatus?.currentTime]);

  return <div style={styles.container}>
    <ChromecastIcon chromecastStore={chromecastStore}/>

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
  urlInput: {
    height: '3rem',
    margin: '2rem 0',
  } as React.CSSProperties,
};
