'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getStatus, play, PLAY } from './lib/actions';
import Controls from './components/Controls';
import FileUpload from './components/FileUpload';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statusTimeoutId: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.status.playerState === PLAY && !this.state.statusTimeoutId) this.getStatus();
    else if (nextProps.status.playerState !== PLAY && this.state.statusTimeoutId) {
      clearTimeout(this.state.statusTimeoutId);
      this.setState({
        statusTimeoutId: null,
      });
    }
  }

  getStatus() {
    const id = setTimeout(() => {
      this.props.getStatus();
      this.getStatus();
    }, 1000);

    this.setState({
      statusTimeoutId: id,
    });
  }

  render() {
    const { play, status } = this.props;
    console.log(status);
    
    return <FileUpload
      play={play}
    >
      <div style={styles.parent}>
    
        <div style={styles.top}>
          <h4>Playlist</h4>
        </div>

        <div style={styles.bottom}>
          <Controls />
        </div>
      </div>
    </FileUpload>;
  }
}

export default connect(
  state => state,
  dispatch => ({
    getStatus: getStatus(dispatch),
    play: play(dispatch),
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