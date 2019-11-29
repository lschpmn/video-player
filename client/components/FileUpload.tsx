import * as React from 'react';
import { useCallback } from 'react';
import { launch } from '../lib/player-actions';
import { useAction } from '../lib/utils';

type Props = {
  children: React.ReactNode,
};

const FileUpload = ({ children }: Props) =>  {
  const launchAction = useAction(launch);

  const drop = useCallback(e => {
    e.preventDefault();
    const { dataTransfer } = e;
    const files = [];

    for (let file of dataTransfer.files) {
      files.push(file);
    }

    console.log(files);
    launchAction(files[0].path);
  }, []);

  const eventNoop = useCallback((e) => e.preventDefault(), []);

  return <div
    id='dropzone'
    style={{ height: '100%', width: '100%' }}
    onDrop={drop}
    onDragOver={eventNoop}
    onDragEnd={eventNoop}
  >
    {children}
  </div>;
};

export default FileUpload;
