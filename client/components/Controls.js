'use strict';

import React, { Component } from 'react';

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
    </div>
  }
}

const styles = {
  container: {
    backgroundColor: '#2196F3',
    color: 'white',
    display: 'flex',
    height: '100%',
    width: '100%',
  },

  icon: {
    cursor: 'pointer',
    display: 'block',
    fontSize: '10vh',
    marginLeft: 10,
  },

  verticalCenter: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
};