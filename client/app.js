'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { play, pause, resume } from './lib/actions';
import Controls from './components/Controls';
import FileUpload from './components/FileUpload';

class App extends Component {
  render() {
    const { play, pause, resume, status } = this.props;
    console.log(status);
    
    return <FileUpload
      play={play}
    >
      <div style={styles.parent}>
    
        <div style={styles.top}>
          <h4>Playlist</h4>
        </div>

        <div style={styles.bottom}>
          <Controls pause={pause} resume={resume} status={status} />
        </div>
      </div>
    </FileUpload>;
  }
}

export default connect(
  state => state,
  dispatch => ({
    play: play(dispatch),
    pause: pause(dispatch),
    resume: resume(dispatch),
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