import axios from 'axios';

const HOST = 'http://localhost:3001/api/files';
export const GET_DRIVES = 'file/GET_DRIVES';
export const GET_FILES = 'file/GET_FILES';

export function getDrives() {
  return async dispatch => {
    const response = await axios.get(HOST + '/get-drives');

    return dispatch({
      type: GET_DRIVES,
      payload: response.data,
    });
  };
}

export function getFiles(path: string, parents: string[]) {
  return async dispatch => {
    const url = HOST + '/list/' + encodeURIComponent(path);
    const response = await axios.get(url);

    return dispatch({
      type: GET_FILES,
      payload: {
        parents,
        path,
        files: response.data,
      },
    });
  };
}