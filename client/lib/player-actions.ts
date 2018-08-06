import axios from 'axios';

export const PLAY = 'PLAYING';
export const PAUSE = 'PAUSED';
export const UPDATE_STATUS = 'UPDATE_STATUS';

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

export function getStatus(dispatch) {
  return () => {
    axios.get(HOST + 'status')
      .then(({data}) => data ? update(data, dispatch) : update({ playerState: PAUSE }, dispatch))
      .catch(err => error(err, dispatch));
  };
}

export function play(path) {
  return async dispatch => {
    const fileUrl = await axios.get(f(`/get-file-url/${encodeURIComponent(path)}`));
    console.log(fileUrl.data);

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