import Line from './Line';

import { ComponentEx } from '../../../util/ComponentEx';

import * as React from 'react';
import { connect } from 'react-redux';

interface ICoord {
  x: number;
  y: number;
}

interface IConnectorProps {
  source?: { id: string, pos: ICoord };
  target?: { id: string, pos: ICoord };
}

class ConnectorImpl extends ComponentEx<IConnectorProps, {}> {
  constructor(props: IConnectorProps) {
    super(props);
  }

  public override render(): JSX.Element {
    const { source, target } = this.props;

    if ((source === undefined) || (target === undefined)) {
      return null;
    }

    const lineClass = target.id !== null ? 'line-connect' : 'line-disconnect';

    return (
      <div className='profile-connector-layer'>
        <Line
          source={source.pos}
          target={target.pos}
          className={lineClass}
          curved={target.id !== null}
        />
      </div>
    );
  }
}

function mapStateToProps(state: any): IConnectorProps {
  return {
    source: state?.session?.profileTransfer?.connection?.source,
    target: state?.session?.profileTransfer?.connection?.target,
  };
}

export default connect(mapStateToProps)(ConnectorImpl);
