'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class FileUpload extends Component {
  constructor(props) {
    super(props);
    
    this.drop = this.drop.bind(this);
    this.eventNoop = this.eventNoop.bind(this);
  }
  
  drop(event) {
    event.preventDefault();
    
    const { dataTransfer } = event;
    const files = [];
    
    for (let file of dataTransfer.files) {
      files.push(file);
    }
    
    console.log(files);
    this.props.play(files[0].path);
  }
  
  eventNoop(event) {
    event.preventDefault();
  }
  
  render() {
    return <div id='dropzone' style={{height: '100%', width: '100%'}} onDrop={this.drop} onDragOver={this.eventNoop} onDragEnd={this.eventNoop} >
      {this.props.children}
    </div>;
  }
}

FileUpload.propTypes = {
  play: PropTypes.func
};