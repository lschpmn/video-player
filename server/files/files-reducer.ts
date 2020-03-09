import { join } from 'path';
import { setFiles } from '../../client/lib/file-actions';
import { SET_CURRENT_LOCATION, THUMBNAIL_REQUEST } from '../../constants';
import { setThumbnail, setThumbnailLoading } from '../action-creators';
import { getDrives, getFileItems, getThumbnail } from './file-utils';

export default async (type: string, payload: any, dispatch: (action: any) => void) => {
  switch (type) {
    case SET_CURRENT_LOCATION: {
      const files = !!payload.length
        ? await getFileItems(join(...payload))
        : await getDrives();

      dispatch(setFiles(files));
      return
    }
    case THUMBNAIL_REQUEST: {
      dispatch(setThumbnailLoading(payload));

      const thumbnail = await getThumbnail(payload);
      dispatch(setThumbnail(payload, thumbnail));
    }
  }
};

