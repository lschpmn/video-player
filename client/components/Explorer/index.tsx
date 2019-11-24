import { get } from 'lodash';
import { join } from 'path';
import * as React from 'react';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ReducerState } from '../../types';
import ExplorerItem from './ExplorerItem';

const Explorer = () => {
  const explorer = useSelector((state: ReducerState) => state.explorer);
  const folderFiles = explorer.currentLocation.length
    ? Object.keys(get(explorer.drives, explorer.currentLocation))
    : Object.keys(explorer.drives);

  const inspectedFolderFiles = useMemo(() => {
    return folderFiles
      .map(folderFile => ({
        ...explorer.inspections[join(...explorer.currentLocation, folderFile)],
        name: folderFile,
      }))
      .sort((a, b) => {
        if (a.type === 'dir' && b.type === 'dir') return 0;
        else if (a.type === 'file' && b.type === 'file') return 0;
        else if (a.type === 'file' && b.type === 'dir') return 1;
        else if (a.type === 'dir' && b.type === 'file') return -1;
      })
      .filter(Boolean);
  }, [folderFiles]);

  return <div style={styles.container}>
    {inspectedFolderFiles.map(drive =>
      <ExplorerItem
        currentLocation={explorer.currentLocation}
        drive={drive}
        key={join(...explorer.currentLocation, drive.name)}
      />
    )}
  </div>;
};

export default Explorer;

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    height: '100%',
    margin: '0 0.5rem',
    overflow: 'auto',
  } as React.CSSProperties,
};
