'use strict';

import React, { Component } from 'react';

export default class App extends Component {
  render() {
    return <div style={{display: 'flex', flexWrap: 'wrap', height: '100%'}}>
      {[0,1,2,3].map(i =>
        <div key={i} style={{width: '50%', border:'1px solid black'}}>
          <h3>test</h3>
        </div>
      )}
    </div>;
  }
}