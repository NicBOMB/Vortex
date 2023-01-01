import { SortDirection } from '../../types/SortDirection';

import Icon from '../Icon';

import * as React from 'react';

export interface IProps {
  direction: SortDirection;
  onSetDirection: (direction: SortDirection) => void;
}

class SortIndicator extends React.Component<IProps, {}> {
  public override render(): JSX.Element {
    const { direction } = this.props;
    return (
      <div style={{ display: 'inline' }}>
        <Icon name={this.icon(direction)} />
      </div>
    );
  }

  private icon(direction: SortDirection): string {
    switch (direction) {
      case 'none': return 'sort-none';
      case 'asc': return 'sort-up';
      case 'desc': return 'sort-down';
      default: return 'question';
    }
  }
}

export default SortIndicator;
