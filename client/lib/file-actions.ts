import { SET_CURRENT_LOCATION, SET_FILES, THUMBNAIL_REQUEST } from '../../constants';
import { FileItem } from '../../types';

export const setCurrentLocation = (currentLocation: string[]) => ({
  payload: currentLocation,
  type: SET_CURRENT_LOCATION,
});

export const setFiles = (files: FileItem[] | string[]) => ({
  payload: files,
  type: SET_FILES,
});

export const thumbnailRequest = (path: string) => ({
  payload: path,
  type: THUMBNAIL_REQUEST,
});
