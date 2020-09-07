import { basename } from "path";
import {
  CONNECT,
  GET_CHROMECASTS,
  GET_MEDIA_STATUS,
  GET_STATUS,
  LAUNCH,
  LAUNCH_APP,
  PAUSE,
  PLAY, SEEK, SET_MUTED, SET_VOLUME, STOP_MEDIA, UPDATE_HISTORY,
} from '../../constants';
import { addServerEvent, setChromecasts } from '../action-creators';
import { getFileUrl, ipAddress } from '../files/file-utils';
import ChromecastEmitter from '../lib/ChromecastEmitter';
import { chromecastEmitter, db } from '../index';

export const playerReducer =  async (type: string, payload: any, dispatch: (action: any) => void) => {
  switch (type) {
    // player
    case CONNECT:
      chromecastEmitter.connect(payload);
      return;
    case GET_CHROMECASTS:
      dispatch(setChromecasts(await ChromecastEmitter.GetChromecasts()));
      return;
    case GET_MEDIA_STATUS:
      chromecastEmitter.getMediaStatus();
      return;
    case GET_STATUS:
      chromecastEmitter.getStatus();
      return;
    case LAUNCH: {
      const url = payload.isUrl
        ? payload.path.replace('127.0.0.1', ipAddress)
        : await getFileUrl(payload.path);

      const title = basename(payload.isUrl ? url : payload.path);
      const prev = db.get(['history', title]).value();
      if (prev) {
        dispatch(addServerEvent({
          payload: prev,
          type: 'continue',
        }));
      }

      await chromecastEmitter.launch(url, title);
      return;
    }
    case LAUNCH_APP:
      chromecastEmitter.launchApp(payload);
      return;
    case PAUSE:
      chromecastEmitter.pause();
      return;
    case PLAY:
      chromecastEmitter.play();
      return;
    case SEEK:
      chromecastEmitter.seek(payload);
      return;
    case SET_MUTED:
      chromecastEmitter.setMuted(payload);
      return;
    case SET_VOLUME:
      chromecastEmitter.setVolume(payload);
      return;
    case STOP_MEDIA:
      chromecastEmitter.stop();
      return;
    case UPDATE_HISTORY:
      const { currentTime, title } = payload;
      await db.set(['history', title], currentTime).write();
      return;
  }
}
