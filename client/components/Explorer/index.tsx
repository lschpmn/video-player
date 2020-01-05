import * as React from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { VIDEO_EXTENSIONS } from '../../../constants';
import { setCurrentLocation } from '../../lib/file-actions';
import { postLocal, requestDrives, requestFileItems, useAction } from '../../lib/utils';
import { FileItem, ReducerState } from '../../types';
import ExplorerItem from './ExplorerItem';

const MAX_INSPECTS = 3;

const Explorer = () => {
  const [files, setFiles] = useState([] as FileItem[]);
  const currentLocation = useSelector((state: ReducerState) => state.explorer.currentLocation);
  const setCurrentLocationAction = useAction(setCurrentLocation);

  useEffect(() => {
    const request = currentLocation.length === 0
      ? requestDrives()
      : requestFileItems(currentLocation.join('/') + '/');

    request
      .then(res => setFiles(res))
      .catch(console.log);
  }, [currentLocation]);

  useEffect(() => {
    const videoFiles = files
      .filter(file => VIDEO_EXTENSIONS.some(s => file.path.endsWith(s)));

    const videoFilesLoading = videoFiles
      .filter(file => file.images === 'loading');

    if (videoFilesLoading.length < MAX_INSPECTS) {
      const videoToLoad = videoFiles.find(videoFile => !videoFile.images);
      if (!videoToLoad) return;

      postLocal('/api/files/inspect', { path: videoToLoad.path })
        .then(res => {
          setFiles(oldFiles => oldFiles
            .map(file => file.path === videoToLoad.path
              ? ({
                ...file,
                images: res,
              })
              : file
            )
          );
        })
        .catch(console.log);

      setFiles(files
        .map(file => file.path === videoToLoad.path
          ? ({
            ...file,
            images: 'loading',
          })
          : file,
        ));
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
        </h3>,
      )}
    </div>
    <div style={styles.itemContainer}>
      {files
        .map((item) =>
          <ExplorerItem
            currentLocation={currentLocation}
            item={item}
            key={item.path}
            name={item.path.split('/').slice(-1)[0]}
          />,
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
