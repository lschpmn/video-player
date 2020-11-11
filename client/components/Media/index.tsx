import isEqual from 'lodash/isEqual';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { connect, getChromecasts, getMediaStatus, PLAYING, updateHistory } from '../../lib/player-actions';
import { useAction } from '../../lib/utils';
import { ReducerState } from '../../types';
import ChromecastIcon from './ChromecastIcon';
import ContinueModal from './ContinueModal';

const PAUSED_STATUS_INTERVAL = 5000;
const PLAYING_STATUS_INTERVAL = 1000;
const UPDATE_HISTORY_INTERVAL = 3; //seconds

const Media = () => {
  const connectAction = useAction(connect);
  const getChromecastsAction = useAction(getChromecasts);
  const getMediaStatusAction = useAction(getMediaStatus);
  const updateHistoryAction = useAction(updateHistory);
  const chromecastStore = useSelector((state: ReducerState) => state.chromecastStore, isEqual);
  const [lastUpdate, setLastUpdate] = useState(0);

  useEffect(() => {
    getChromecastsAction();
  }, []);

  useEffect(() => {
    if (chromecastStore.chromecasts[0] && !chromecastStore.loading && !chromecastStore.isConnected) {
      setTimeout(() => connectAction(chromecastStore.chromecasts[0]), 15000);
    }
  }, [chromecastStore.chromecasts[0], chromecastStore.loading, chromecastStore.isConnected]);

  useEffect(() => {
    const isPlaying = chromecastStore.mediaStatus?.playerState === PLAYING;
    const intervalId = setInterval(
      () => getMediaStatusAction(),
      isPlaying ? PLAYING_STATUS_INTERVAL : PAUSED_STATUS_INTERVAL
    );

    return () => clearInterval(intervalId);
  }, [chromecastStore.mediaStatus?.playerState]);

  useEffect(() => {
    const isPlaying = chromecastStore.mediaStatus?.playerState === PLAYING;
    if (isPlaying) {
      const currentTime = chromecastStore.mediaStatus.currentTime;
      if (Math.abs(currentTime - lastUpdate) > UPDATE_HISTORY_INTERVAL) {
        setLastUpdate(currentTime);
        updateHistoryAction(chromecastStore.mediaStatus.title, ~~currentTime);
      }
    }
  }, [chromecastStore.mediaStatus?.currentTime]);

  return <div style={styles.container}>
    <ChromecastIcon chromecastStore={chromecastStore}/>

    <div style={styles.name}>{chromecastStore.mediaStatus?.title}</div>
    <div style={styles.name}>{chromecastStore.mediaStatus?.subtitle}</div>

    <div style={{ flex: 1 }}/>

    <ContinueModal />
  </div>;
};

export default Media;

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    position: 'relative',
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
