import axios from 'axios';
import * as Chromecast from './Chromecast';

export const PLAY = 'PLAYING';
export const PAUSE = 'PAUSED';
export const UPDATE_STATUS = 'UPDATE_STATUS';

const c = path => `http://localhost:3000/api/cast${path}`;
const f = path => `http://localhost:3000/api/files${path}`;
const HOST = 'http://localhost:3000/api/cast/';
const NEW_HOST = 'http://localhost:3001/api/';

export function changeVolume(dispatch) {
  return volume => {
    axios.post(HOST + 'volume', { volume })
      .then(({data}) => update(data, dispatch))
      .catch(err => error(err, dispatch));
  };
}

export function getStatus() {
  return async dispatch => {
    try {
      const status = Chromecast.getStatus();
      console.log(status);

      /*const status = await axios.post(c('/status'), {
        address: 'Chromecast-Ultra-39bb708d7a3a1ac3d41d25afede84f0f._googlecast._tcp.local',
      });

      console.log('status');
      console.log(status);*/
    } catch (err) {
      console.error(err);
    }
  };
}

export function start(path: string) {
  return async dispatch => {
    const urlResponse = await axios.get(f(`/get-file-url/${encodeURIComponent(path)}`));
    console.log(urlResponse.data);

    const playResponse = await axios.post(c('/start'), {
      address: 'Chromecast-Ultra-39bb708d7a3a1ac3d41d25afede84f0f._googlecast._tcp.local',
      url: urlResponse.data,
    });
    console.log(playResponse.data);

    //not ready yet
    /*return dispatch({
      type: UPDATE_STATUS,
      payload: status,
    });*/
  };
}

export function pause(dispatch) {
  return () => {
    axios.post(HOST + 'pause')
      .then(({data}) => update(data, dispatch))
      .catch(err => error(err, dispatch));
  };
}

export function resume(dispatch) {
  return () => {
    axios.post(HOST + 'resume')
      .then(({data}) => update(data, dispatch))
      .catch(err => error(err, dispatch));
  };
}

export function seek(dispatch) {
  return seconds => {
    axios.post(HOST + 'seek', {seconds})
      .then(({data}) => update(data, dispatch))
      .catch(err => error(err, dispatch));
  };
}

function error(err, dispatch) {
  console.log(err);
  dispatch({
    type: UPDATE_STATUS,
    data: { playerState: PAUSE },
  });
}

function update(data, dispatch) {
  dispatch({
    type: UPDATE_STATUS,
    data,
  });
}