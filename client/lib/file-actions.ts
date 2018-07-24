import axios from 'axios';

const HOST = 'http://localhost:3001/api/files';
const GET_FILES = 'file/GET_FILES';

export async function getFiles(path: string) {
  const url = HOST + '/list/' + encodeURIComponent(path);
  const result = await axios.get(url);
  console.log(result);
}