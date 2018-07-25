import * as React from 'react';

type Props = {
  name: string,
};

export default class Directory extends React.Component<Props> {
  render() {
    const { name } = this.props;

    return <div>{name}</div>;
  }
}