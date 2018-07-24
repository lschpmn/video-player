import axios from 'axios';

const HOST = 'http://localhost:3001/api/files';
export const GET_DRIVES = 'file/GET_DRIVES';
export const GET_FILES = 'file/GET_FILES';

export function getDrives() {
  return async (dispatch) => {
    const response = await axios.get(HOST + '/get-drives');

    return dispatch({
      type: GET_DRIVES,
      payload: response.data,
    });
  };
}

export async function getFiles(path: string) {
  const url = HOST + '/list/' + encodeURIComponent(path);
  const result = await axios.get(url);
  console.log(result);
}