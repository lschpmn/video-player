import * as React from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { VIDEO_EXTENSIONS } from '../../../constants';
import { setCurrentLocation, thumbnailRequest } from '../../lib/file-actions';
import { useAction } from '../../lib/utils';
import { ReducerState } from '../../types';
import ExplorerItem from './ExplorerItem';

const MAX_INSPECTS = 3;

const Explorer = () => {
  const currentLocation = useSelector((state: ReducerState) => state.explorer.currentLocation);
  const files = useSelector((state: ReducerState) => state.explorer.files);
  const setCurrentLocationAction = useAction(setCurrentLocation);
  const thumbnailRequestAction = useAction(thumbnailRequest);

  useEffect(() => {
    setCurrentLocationAction(currentLocation);
  }, []);

  useEffect(() => {
    const videoFiles = files
      .filter(file => VIDEO_EXTENSIONS.some(s => file.path.endsWith(s)));

    const videoFilesLoading = videoFiles
      .filter(file => file.images === 'loading');

    if (videoFilesLoading.length < MAX_INSPECTS) {
      const videoToLoad = videoFiles.find(videoFile => !videoFile.images);
      if (!videoToLoad) return;

      thumbnailRequestAction(videoToLoad.path);
    }
  }, [files]);

  return <div style={styles.container}>
    <div style={{ display: 'flex' }}>
      <h3 style={styles.explorerItem} onMouseDown={() => setCurrentLocationAction([])}>
        /
      </h3>
      {currentLocation.map((loc, i) =>
        <h3
          key={[...currentLocation.slice(0, i + 1), loc].join('/')}
          onMouseDown={() => setCurrentLocationAction(currentLocation.slice(0, i + 1))}
          style={styles.explorerItem}
        >
          {loc}/
        </h3>
      )}
    </div>
    <div style={styles.itemContainer}>
      {files
        .map(item =>
          <ExplorerItem
            item={item}
            key={item.path}
          />
        )}
    </div>
  </div>;
};

export default Explorer;

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  } as React.CSSProperties,
  explorerItem: {
    cursor: 'pointer',
    margin: '4px 0',
    paddingLeft: '0.5rem',
  } as React.CSSProperties,
  itemContainer: {
    alignContent: 'start',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: '0 0.5rem',
    overflow: 'auto',
  } as React.CSSProperties,
};
