'use strict';

import React, { Component } from 'react';
import { Glyphicon } from 'react-bootstrap';
import { connect } from 'react-redux';
import { changeMedia, changePlay } from './lib/actions';
import FileUpload from './components/FileUpload';
import { actions } from './lib/reducers';
import Streamer from './lib/Streamer';

class App extends Component {
  constructor() {
    super();
    this.state = {
      streamer: null,
    };
  }
  
  componentDidMount() {
    this.setState({
      streamer: new Streamer(),
    });
  }

  render() {
    const { changePlay, changeMedia, play } = this.props;
    
    console.log(this.props);
    
    return <FileUpload
      changeMedia={filePath => changeMedia(filePath)}
    >
      <div style={styles.parent}>
    
        <div style={{height: '75%', width: '100%'}}>
          <h4>Playlist</h4>
        </div>
    
        <div style={styles.controlContainer}>
          <div style={styles.controlItems}>
            <Glyphicon glyph='fast-backward' style={styles.icon} />
          </div>
      
          <div style={styles.controlItems}>
            <Glyphicon glyph='backward' style={styles.icon} />
          </div>
      
          <div style={styles.controlItems} onClick={() => changePlay(!play)}>
            <Glyphicon glyph={this.props.play ? 'pause' : 'play'} style={styles.icon} />
          </div>
      
          <div style={styles.controlItems}>
            <Glyphicon glyph='forward' style={styles.icon} />
          </div>
      
          <div style={styles.controlItems}>
            <Glyphicon glyph='fast-forward' style={styles.icon} />
          </div>
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
  controlContainer: {
    display: 'flex',
    height: '25%',
    width: '100%',
  },

  controlItems: {
    fontSize: 50,
    width: '20%',
  },

  icon: {
    cursor: 'pointer',
    display: 'block',
    textAlign: 'center',
  },

  parent: {
    display: 'flex',
    flexWrap: 'wrap',
    height: '100%',
  },
};