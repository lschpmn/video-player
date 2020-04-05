import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { shell } from 'electron';
import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { VIDEO_EXTENSIONS } from '../../../constants';
import { FileItem } from '../../../types';
import { setCurrentLocation, thumbnailRequest } from '../../lib/file-actions';
import { useAction } from '../../lib/utils';
import { ReducerState } from '../../types';
import ExplorerItem from './ExplorerItem';

const MAX_INSPECTS = 3;

const Explorer = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [selectedItem, setSelectedItem] = useState(null as FileItem);
  const currentLocation = useSelector((state: ReducerState) => state.explorer.currentLocation);
  const files = useSelector((state: ReducerState) => state.explorer.files);
  const setCurrentLocationAction = useAction(setCurrentLocation);
  const thumbnailRequestAction = useAction(thumbnailRequest);

  const closeMenu = useCallback(() => setMousePos({ x: 0, y: 0 }), [setMousePos]);

  const onRightClick = useCallback((e, item: FileItem) => {
    setSelectedItem(item);
    setMousePos({ x: e.clientX, y: e.clientY });
  }, [setMousePos, setSelectedItem]);

  const openFile = useCallback(() => {
    shell.openItem(selectedItem.path);
    closeMenu();
  }, [closeMenu, selectedItem]);

  const showItem = useCallback(() => {
    shell.showItemInFolder(selectedItem.path);
    closeMenu();
  }, [closeMenu, selectedItem]);

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
            onRightClick={onRightClick}
          />
        )}
    </div>
    <Menu
      anchorReference={'anchorPosition'}
      anchorPosition={{ left: mousePos.x, top: mousePos.y }}
      onContextMenu={closeMenu}
      open={!!mousePos.x}
      onClose={closeMenu}
    >
      <MenuItem onClick={showItem}>Open {selectedItem?.type === 'dir' ? 'folder' : 'file'} in explorer</MenuItem>
      {selectedItem?.type === 'file' && <MenuItem onClick={openFile}>Open file</MenuItem>}
    </Menu>
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
