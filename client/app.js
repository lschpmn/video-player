'use strict';

import React, { Component } from 'react';

export default class App extends Component {
  render() {
    return <div style={{display: 'flex', flexWrap: 'wrap', height: '100%'}}>
      <div style={{width: '50%'}}>
        <h4>Playlist</h4>
      </div>

      <div style={{width: '50%'}}>
        <h4>Dropzone</h4>
      </div>

      <div style={{width: '100%'}}>
        <h4>Controls</h4>
      </div>
    </div>;
  }
}