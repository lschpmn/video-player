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
    
        <div style={styles.top}>
          <h4>Playlist</h4>
        </div>

        <div style={styles.bottom}>
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
  bottom: {
    alignSelf: 'flex-end',
    width: '100%',
  },

  parent: {
    alignItems: 'stretch',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },

  top: {
    flexGrow: 1,
    width: '100%',
  },
};