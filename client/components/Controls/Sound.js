'use strict';

import React, { Component } from 'react';
import { Slider } from 'material-ui';

export default class Sound extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      val: 1,
    };
  }

  render() {
    const { level } = this.props.volume;
    const { val } = this.state;
    
    return <div
      onMouseEnter={() => this.setState({show: true})}
      onMouseLeave={() => this.setState({show: false})}
      style={{...styles.container, ...this.props.style}}
    >

      {this.state.show &&
        <Slider
          axis={'y'}
          onChange={(e, val) => this.setState({val})}
          style={styles.slider}
          sliderStyle={{marginTop: '1rem',}}
          value={val}
        />
      }

      <i
        className={'fa fa-volume-up'}
        style={styles.icon}
      />
    </div>
  }
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'relative',
    width: '3rem',
  },

  icon: {
    cursor: 'pointer',
    display: 'block',
    fontSize: '2rem',
    margin: '0 auto',
    width: '2rem',
  },

  slider: {
    backgroundColor: 'black',
    bottom: '3rem',
    height: '5rem',
    left: '1rem',
    opacity: 0.6,
    paddingBottom: '1rem',
    position: 'absolute',
  },
};