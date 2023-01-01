import Dashlet from '../../../controls/Dashlet';
import RadialProgress from '../../../controls/RadialProgress';
import {IState} from '../../../types/IState';
import {ComponentEx, connect} from '../../../util/ComponentEx';
import { bytesToString } from '../../../util/util';

// import {speedDataPoints} from '../reducers/state';
import {IDownload} from '../types/IDownload';

import { TFunction } from 'i18next';
import * as React from 'react';

interface IBaseProps {
  t: TFunction;
}

interface IConnectedProps {
  speeds: number[];
  files: { [id: string]: IDownload };
}

type IProps = IBaseProps & IConnectedProps;

/**
 * download speed dashlet
 */
class DownloadsDashlet extends ComponentEx<IProps, {}> {
  public override render(): JSX.Element {
    const {t, speeds} = this.props;

    const progress = this.downloadProgress();

    let content: JSX.Element = null;
    if (progress.length === 0) {
      content = (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }} >
          <div style={{ flex: '1 1 0' }} />
          <h5 style={{ textAlign: 'center' }}>{t('No downloads active')}</h5>
          <div style={{ flex: '1 1 0' }} />
        </div>
      );
    } else {
      content = (
        <div style={{ textAlign: 'center', position: 'relative', height: '100%' }} >
            <RadialProgress
              style={{ height: '100%' }}
              totalRadius={100}
              maxWidth={20}
              offset={50}
              data={progress}
              gap={2}
            />
            <div
              style={{
                position: 'absolute',
                top: 0, left: 0,
                width: '100%', height: '100%',
                display: 'inline-flex',
              }}
            >
              <div
                style={{
                  marginTop: 'auto',
                  marginBottom: 'auto',
                  width: '100%',
                }}
              >
                {bytesToString(speeds[speeds.length - 1] || 0)}/s
              </div>
            </div>
        </div>
      );
    }

    return (
      <Dashlet title={t('Download Progress')} className='dashlet-download' >
        {content}
      </Dashlet>
    );
  }

  private downloadProgress = () => {
    const { files } = this.props;

    return Object.keys(files)
      .filter(file => ['paused', 'started'].indexOf(files[file].state) !== -1)
      .map(file => ({
        min: 0,
        max: files[file].size || files[file].received || 0,
        value: files[file].received || 0,
        class: files[file].state === 'paused' ? 'paused' : 'running',
      }));
  }
}

function mapStateToProps(state: IState): IConnectedProps {
  return {
    speeds: state.persistent.downloads.speedHistory,
    files: state.persistent.downloads.files,
  };
}

export default connect(mapStateToProps)(
  DownloadsDashlet) as unknown as React.ComponentClass<{}>;
