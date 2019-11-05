import { GET_DRIVES_SERVER, GET_FILES_SERVER, INSPECT_FILE_SERVER } from '../../constants';

export const getDrives = () => ({
  type: GET_DRIVES_SERVER,
});

export const getFiles = (location: string[]) => ({
  payload: location,
  type: GET_FILES_SERVER,
});

export const inspectFile = (path: string) => ({
  payload: path,
  type: INSPECT_FILE_SERVER,
});
