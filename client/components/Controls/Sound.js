'use strict';

import React, { Component } from 'react';
import { Slider } from 'material-ui';

export default class Sound extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
    };
  }

  render() {
    const { level } = this.props.volume;
    
    return <div
      onMouseEnter={() => this.setState({show: true})}
      onMouseLeave={() => this.setState({show: false})}
      style={this.props.style}
    >
      {this.state.show &&
        <Slider value={level} />
      }

      <i
        className={'fa fa-volume-up'}
        style={styles.icon}
      />
    </div>
  }
}

const styles = {
  icon: {
    cursor: 'pointer',
    display: 'block',
    fontSize: '2rem',
    marginLeft: 10,
    width: '2rem',
  },
};