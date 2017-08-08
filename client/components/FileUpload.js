'use strict';

import React, { Component } from 'react';


export default class FileUpload extends Component {
  constructor() {
    super();
    
    this.drop = this.drop.bind(this);
    this.eventNoop = this.eventNoop.bind(this);
  }
  
  drop(event) {
    event.preventDefault();
    event.persist();
    
    const { dataTransfer } = event;
    const files = [];
    
    for (let file of dataTransfer.files) {
      files.push(file);
    }
    
    console.log(files);
    
    console.log(event.dataTransfer);
  }
  
  eventNoop(event) {
    event.preventDefault();
  }
  
  render() {
    return <div id='dropzone' style={{height: '100%', width: '100%'}} onDrop={this.drop} onDragOver={this.eventNoop} onDragEnd={this.eventNoop} >
      Drop Here
    </div>;
  }
}