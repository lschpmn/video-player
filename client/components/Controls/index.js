'use strict';

import React, { Component } from 'react';
import Slider from 'material-ui/Slider';

import './controls-style.css';

export default class Controls extends Component {
  render() {
    const { changePlay, play } = this.props;

    return <div style={styles.container}>
      <div style={styles.verticalCenter}>
        <i
          className={`fa fa-${play ? 'pause' : 'play'}`}
          onClick={() => changePlay(!play)}
          style={styles.icon}
        />
      </div>

      <Slider className='main-slider' style={styles.slider} />
    </div>
  }
}

const styles = {
  container: {
    alignItems: 'stretch',
    backgroundColor: '#2196F3',
    color: 'white',
    display: 'flex',
    height: '3rem',
    width: '100%',
  },

  icon: {
    cursor: 'pointer',
    display: 'block',
    fontSize: '2rem',
    marginLeft: 10,
    width: '2rem',
  },

  slider: {
    flexGrow: 1,
  },

  verticalCenter: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
};