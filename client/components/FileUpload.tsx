'use strict';

import * as React from 'react';

type Props = {
  start: (path: string) => void,
};

export default class FileUpload extends React.Component<Props> {
  drop = event => {
    event.preventDefault();
    
    const { dataTransfer } = event;
    const files = [];
    
    for (let file of dataTransfer.files) {
      files.push(file);
    }
    
    console.log(files);
    this.props.start(files[0].path);
  };
  
  eventNoop = (event) => {
    event.preventDefault();
  };
  
  render() {
    return <div
      id='dropzone'
      style={{ height: '100%', width: '100%' }}
      onDrop={this.drop}
      onDragOver={this.eventNoop}
      onDragEnd={this.eventNoop}
    >
      {this.props.children}
    </div>;
  }
}