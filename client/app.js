'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { changeMedia, changePlay } from './lib/actions';
import Controls from './components/Controls';
import FileUpload from './components/FileUpload';

class App extends Component {
  render() {
    const { changePlay, changeMedia, play } = this.props;
    
    return <FileUpload
      changeMedia={filePath => changeMedia(filePath)}
    >
      <div style={styles.parent}>
    
        <div style={{height: '90%', width: '100%'}}>
          <h4>Playlist</h4>
        </div>

        <div style={{height: '10%', width: '100%'}}>
          <Controls changePlay={changePlay} play={play} />
        </div>
      </div>
    </FileUpload>;
  }
}

export default connect(
  state => state,
  dispatch => ({
    changeMedia: changeMedia(dispatch),
    changePlay: changePlay(dispatch),
  })
)(App);

const styles = {
  parent: {
    display: 'flex',
    flexWrap: 'wrap',
    height: '100%',
  },
};