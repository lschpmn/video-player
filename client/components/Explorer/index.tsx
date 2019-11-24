import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import Folder from '@material-ui/icons/Folder';
import { get } from 'lodash';
import { join } from 'path';
import * as React from 'react';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getFiles } from '../../lib/file-actions';
import { useAction } from '../../lib/utils';
import { ReducerState } from '../../types';

const Explorer = () => {
  const getFilesAction = useAction(getFiles);
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

  if (explorer.currentLocation.length) {
    folderFiles.forEach(folderFile => {
      console.log(explorer.inspections[join(...explorer.currentLocation, folderFile)]);
    });
  }

  return <div style={styles.container}>
    {inspectedFolderFiles.map(drive =>
      <div key={join(...explorer.currentLocation, drive.name)} style={styles.folder}>
        {drive.type === 'file'
          ? <InsertDriveFileIcon style={styles.folderIcon}/>
          : <Folder onDoubleClick={() => getFilesAction([...explorer.currentLocation, drive.name])} style={styles.folderIcon}/>}
        <div style={styles.folderText}>{drive.name}</div>
      </div>,
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
  folder: {
    display: 'flex',
    flexDirection: 'column',
    margin: '1rem',
    width: '8rem',
  } as React.CSSProperties,
  folderIcon: {
    fontSize: '5rem',
    margin: '0 auto',
  } as React.CSSProperties,
  folderText: {
    textAlign: 'center',
    wordBreak: 'break-all',
  } as React.CSSProperties,
};
