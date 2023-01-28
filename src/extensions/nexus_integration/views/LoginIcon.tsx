import { setDialogVisible } from '../../../actions/session';
import Icon from '../../../controls/Icon';
import Image from '../../../controls/Image';
import * as tooltip from '../../../controls/TooltipControls';
import { IState } from '../../../types/IState';
import { ComponentEx, connect, translate } from '../../../util/ComponentEx';
import getVortexPath from '../../../util/getVortexPath';
import opn from '../../../util/opn';

import { clearOAuthCredentials, setUserAPIKey } from '../actions/account';
import { IValidateKeyData } from '../types/IValidateKeyData';

import { FALLBACK_AVATAR, NEXUS_BASE_URL } from '../constants';

import NexusT from '@nexusmods/nexus-api';
import * as path from 'path';
import * as React from 'react';
import { WithTranslation } from 'react-i18next';
import * as Redux from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { pathToFileURL } from 'url';
import { isLoggedIn } from '../selectors';

export interface IBaseProps extends WithTranslation {
  nexus: NexusT;
}

interface IConnectedProps {
  isLoggedIn: boolean;
  userInfo: IValidateKeyData;
  networkConnected: boolean;
}

interface IActionProps {
  onSetAPIKey: (APIKey: string) => void;
  onClearOAuthCredentials: () => void;
  onShowDialog: () => void;
}

type IProps = IBaseProps & IConnectedProps & IActionProps;

const START_TIME = Date.now();

class LoginIcon extends ComponentEx<IProps, {}> {
  public override render(): JSX.Element {
    const { t, networkConnected } = this.props;
    if (!networkConnected) {
      return (
        <span id='login-control'>
          <tooltip.Icon name='disconnected' tooltip={t('Network is offline')} />
        </span>
      );
    }
    return (
      <span id='login-control'>
        {this.renderLoginName()}
        {this.renderAvatar()}
      </span >
    );
  }

  private logOut = () => {
    const { onClearOAuthCredentials, onSetAPIKey } = this.props;
    onSetAPIKey(undefined);
    onClearOAuthCredentials();
  }

  private renderLoginName() {
    const { t, userInfo } = this.props;

    if (this.isLoggedIn()) {
      return (
        <div>
          <div className='username'>
            {userInfo.name}
          </div>
          <div className='logout-button'>
            <a onClick={this.logOut}>{t('Log out')}</a>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  private renderAvatar() {
    const { t, userInfo } = this.props;

    const loggedIn = this.isLoggedIn();

    const fallback =
      pathToFileURL(path.join(getVortexPath('assets'), '..', FALLBACK_AVATAR)).href;

    const profileIcon = !!userInfo?.profileUrl
      ? `${userInfo.profileUrl}?r_${START_TIME}`
      : fallback;

    return (
      <tooltip.Button
        id='btn-login'
        tooltip={loggedIn ? t('Show Details') : t('Log in')}
        onClick={this.showLoginLayer}
      >
        {loggedIn ? (
          <Image
            srcs={[profileIcon, fallback]}
            circle
            style={{ height: 32, width: 32 }}
          />
        ) : (
            <Icon name='user' className='logout-avatar' />
          )
        }
      </tooltip.Button>
    );
  }

  private showLoginLayer = () => {
    const { userInfo } = this.props;
    if (!this.isLoggedIn()) {
      this.context.api.events.emit('analytics-track-click-event', 'Profile', 'Site profile');
      this.setDialogVisible(true);
    } else {
      opn(`${NEXUS_BASE_URL}/users/${userInfo.userId}`).catch(err => undefined);
    }
  }

  private isLoggedIn() {
    const { isLoggedIn, userInfo } = this.props;
    return isLoggedIn && (userInfo !== undefined) && (userInfo !== null);
  }

  private setDialogVisible(visible: boolean): void {
    this.props.onShowDialog();
  }
}

function mapStateToProps(state: IState): IConnectedProps {
  return {
    isLoggedIn: isLoggedIn(state),
    userInfo: (state.persistent as any).nexus.userInfo,
    networkConnected: state.session.base.networkConnected,
  };
}

function mapDispatchToProps(dispatch: ThunkDispatch<any, null, Redux.Action>): IActionProps {
  return {
    onSetAPIKey: (APIKey: string) => dispatch(setUserAPIKey(APIKey)),
    onClearOAuthCredentials: () => dispatch(clearOAuthCredentials(null)),
    onShowDialog: () => dispatch(setDialogVisible('login-dialog')),
  };
}

export default
  translate(['common'])(
    connect(mapStateToProps, mapDispatchToProps)(
      LoginIcon)) as React.ComponentClass<IBaseProps>;
