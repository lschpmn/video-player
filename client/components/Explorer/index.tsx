import { join } from 'path';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { requestDrives, requestFileItems } from '../../lib/utils';
import { FileStructure, ReducerState } from '../../types';
import ExplorerItem from './ExplorerItem';

const Explorer = () => {
  const [files, setFiles] = useState(null as FileStructure | null);
  const currentLocation = useSelector((state: ReducerState) => state.explorer.currentLocation);

  useEffect(() => {
    const request = currentLocation.length === 0
      ? requestDrives()
      : requestFileItems(currentLocation.join('/') + '/');

    request
      .then(res => setFiles(res))
      .catch(console.log);
  }, [currentLocation]);

  return <div style={styles.container}>
    {files && Object
      .entries(files)
      .sort(([aName, aItem], [bName, bItem]) => {
        if (aItem.type === 'dir' && bItem.type === 'dir') {
          return aName.localeCompare(bName);
        } else if (aItem.type === 'dir' && bItem.type !== 'dir') {
          return -1;
        } else if (aItem.type !== 'dir' && bItem.type === 'dir') {
          return 1;
        }

        return aName.localeCompare(bName);
      })
      .map(([name, item]) =>
        <ExplorerItem
          currentLocation={currentLocation}
          drive={item}
          key={join(...currentLocation, name)}
          name={name}
        />,
      )}
  </div>;
};

export default Explorer;

const styles = {
  container: {
    alignContent: 'start',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    height: '100%',
    margin: '0 0.5rem',
    overflow: 'auto',
  } as React.CSSProperties,
};
