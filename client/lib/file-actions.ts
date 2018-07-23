import axios from 'axios';

const HOST = 'http://localhost:3001/api';
const GET_FILES = 'file/GET_FILES';

export async function getFiles(path: string) {
  const result = await axios.get(HOST + '/file/' + path);
  console.log(result);
}