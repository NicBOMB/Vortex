import ProgressBar from '../../../controls/ProgressBar';
import RadialProgress from '../../../controls/RadialProgress';
import { IDiscoveryState } from '../../../types/IState';
import { connect, PureComponentEx, translate } from '../../../util/ComponentEx';

import * as React from 'react';

export interface IBaseProps {
  slim: boolean;
}

interface IConnectedProps {
  discovery: IDiscoveryState;
}

type IProps = IBaseProps & IConnectedProps;

class ProgressFooter extends PureComponentEx<IProps, {}> {
  public override render(): JSX.Element {
    const { t, discovery, slim } = this.props;

    const phaseIds = Object.keys(discovery.phases);

    if (!discovery.running) {
      return null;
    }

    const totalProgress =
      phaseIds.map((idx) => discovery.phases[idx].progress).reduce(
        (p: number, e): number => (p += e), 0
      ) / phaseIds.length;

    if (slim) {
      return (
        <div>
          <div className='discovery-footer-label'>{t('Scan')}</div>
          <RadialProgress
            totalRadius={32}
            data={[{ min: 0, max: 100, value: totalProgress, class: 'running' }]}
          />
        </div>
      );
    } else {
      return (
        <div className='discovery-footer'>
          <div className='discovery-footer-label'>{t('Game discovery')}</div>
          <ProgressBar min={0} max={100} now={totalProgress} />
        </div>
      );
    }
  }
}

function mapStateToProps(state: any): IConnectedProps {
  return {
    discovery: state.session.discovery,
  };
}

export default
  translate(['common'])(
    connect(mapStateToProps)(
      ProgressFooter)) as React.ComponentClass<IBaseProps>;
