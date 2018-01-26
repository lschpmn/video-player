'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { play, pause, resume } from './lib/actions';
import Controls from './components/Controls';
import FileUpload from './components/FileUpload';
import { PLAY } from './lib/actions';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statusTimeoutId: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);

    if (nextProps.status.playerState === PLAY && !this.state.statusTimeoutId) this.getStatus();
  }

  getStatus() {
    const id = setTimeout(() => this.getStatus(), 1000);//stand in

    this.setState({
      statusTimeoutId: id,
    });
  }

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