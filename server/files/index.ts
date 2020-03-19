import { setFiles } from '../../client/lib/file-actions';
import { GET_DRIVES, GET_FILES, SET_CURRENT_LOCATION, THUMBNAIL_REQUEST } from '../../constants';
import { setThumbnail } from '../action-creators';
import { getDrives, getFileItems, getThumbnail } from './file-utils';

export const filesReducer = async (type: string, payload: any, dispatch: (action: any) => void) => {
  switch (type) {
    case SET_CURRENT_LOCATION: {
      const files = !!payload.length
        ? await getFileItems(payload.join('\\'))
        : await getDrives();

      dispatch(setFiles(files));
      return;
    }
    case THUMBNAIL_REQUEST: {
      const thumbnail = await getThumbnail(payload);
      dispatch(setThumbnail(payload, thumbnail));
    }
  }
};

export const filesRequest = async (type: string, data: any, res: (...x: any) => void) => {
  switch(type) {
    case GET_DRIVES:
      res(await getDrives());
      return;
    case GET_FILES:
      res(await getFileItems(data));
      return;
  }
};
