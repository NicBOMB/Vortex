import { showDialog } from '../../../actions/notifications';
import ContextMenu from '../../../controls/ContextMenu';
import FormFeedback from '../../../controls/FormFeedback';
import Icon from '../../../controls/Icon';
import Modal from '../../../controls/Modal';
import Spinner from '../../../controls/Spinner';
import { Button, IconButton } from '../../../controls/TooltipControls';
import { ComponentEx, connect, translate } from '../../../util/ComponentEx';
import { UserCanceled } from '../../../util/CustomErrors';
import { log } from '../../../util/log';
import opn from '../../../util/opn';

import { setUserAPIKey } from '../actions/account';
import { setLoginId } from '../actions/session';
import { NEXUS_BASE_URL } from '../constants';
import { IValidateKeyData } from '../types/IValidateKeyData';
import { getPageURL } from '../util/sso';

import { clipboard } from 'electron';
import { TFunction } from 'i18next';
import * as React from 'react';
import { Alert, ControlLabel, FormControl, FormGroup,
         InputGroup,
         ModalBody } from 'react-bootstrap';
import { findDOMNode } from 'react-dom';
import { WithTranslation } from 'react-i18next';
import * as Redux from 'redux';
import { ThunkDispatch } from 'redux-thunk';

const API_ACCESS_URL = `${NEXUS_BASE_URL}/users/myaccount?tab=api+access`;

export interface IBaseProps extends WithTranslation {
  visible: boolean;
  onHide: () => void;
  onCancelLogin: () => void;
}

interface IConnectedProps {
  userInfo: IValidateKeyData;
  loginId: string;
  loginError: string;
}

interface IActionProps {
  onSetAPIKey: (APIKey: string) => void;
  onShowLoginError: (message: string) => void;
  onResetLoginId: () => void;
}

interface ILoginInProgressProps {
  t: TFunction;
  loginId: string;
  onCopyToClipboard: () => void;
}

function LoginInProgress(props: ILoginInProgressProps) {
  const { t, loginId, onCopyToClipboard } = props;
  return (
    <form>
      <FormGroup>
        <ControlLabel>
          {t('Vortex should have opened the following url in your default browser. '
            + 'If that failed, please copy the url into your browser manually.')}
        </ControlLabel>
        <InputGroup>
          <FormControl
            type='text'
            value={getPageURL(loginId)}
            disabled={true}
          />
          <InputGroup.Addon>
            <IconButton
              className='btn-embed'
              icon='clipboard'
              tooltip={t('Copy to clipboard')}
              onClick={onCopyToClipboard}
            />
          </InputGroup.Addon>
        </InputGroup>
      </FormGroup>
    </form>
  );
}

function nop() {
  // nop
}

type IProps = IBaseProps & IConnectedProps & IActionProps;

interface ILoginDialogState {
  troubleshoot: boolean;
  apiKeyInput: string;
  requested: boolean;
  context: { x: number, y: number };
}

class LoginDialog extends ComponentEx<IProps, ILoginDialogState> {
  private mKeyValidation = /^[a-zA-Z0-9\-]*$/;
  private mModalRef = React.createRef<ModalBody>();

  constructor(props: IProps) {
    super(props);

    this.initState({
      troubleshoot: false,
      apiKeyInput: '',
      requested: false,
      context: undefined,
    });
  }

  public override UNSAFE_componentWillReceiveProps(newProps: IProps) {
    if (newProps.visible && !this.props.visible) {
      this.nextState.troubleshoot = false;
      this.nextState.apiKeyInput = '';
    }
    if ((newProps.loginId !== this.props.loginId)
        && (this.props.loginId === undefined)) {
      this.nextState.troubleshoot = false;
      this.nextState.apiKeyInput = '';
    }
    if (newProps.loginError !== this.props.loginError) {
      this.nextState.troubleshoot = true;
    }
  }

  public override render(): JSX.Element {
    const { troubleshoot } = this.state;
    const { t, loginId, visible } = this.props;

    return (
      <Modal
        backdrop='static'
        id='login-dialog'
        show={visible || (loginId !== undefined)}
        onHide={this.hide}
      >
        <Modal.Body ref={this.mModalRef}>
          <IconButton
            className='close-button'
            id='btn-close-login'
            onClick={this.close}
            tooltip={t('Close')}
            icon='close'
          />
          {
            troubleshoot
              ? this.renderTroubleshoot()
              : this.renderRegular()
          }
        </Modal.Body>
      </Modal>
    );
  }

  private renderRegular(): JSX.Element {
    const { t, loginId } = this.props;
    const { requested } = this.state;
    return (
      <div className='login-content'>
        <Icon
          className='nexus-header'
          name='nexus-header'
          svgStyle='#login-dialog path { fill: black }'
        />
        <div className='login-instructions'>
          {t('Please log in or register on the Nexus Mods website to log in on vortex!')}
        </div>
        {loginId !== undefined ? [(
          <LoginInProgress
            key='login-in-progress'
            t={t}
            loginId={loginId}
            onCopyToClipboard={this.copyToClipboard}
          />
        ), (
          <Button
            key='login-press-authorise'
            onClick={nop}
            tooltip={t('Please click "Authorise" on the website')}
            disabled={true}
          >
            <div>
              <Spinner />
              {t('Please click "Authorise" on the website')}
            </div>
          </Button>
        ), (
          <a
            key='troubleshoot-button'
            onClick={this.troubleshoot}
          >
            {t('Not working? Try manual login.')}
          </a>
        ),
        ] : (
          <Button
            onClick={this.login}
            tooltip={t('Opens the Nexus Mods page in your default browser')}
            disabled={requested || (loginId !== undefined)}
          >
            {(requested || (loginId !== undefined)) ? <Spinner /> : t('Log In On Website')}
          </Button>
        )}
      </div>
    );
  }

  private renderTroubleshoot() {
    const { apiKeyInput, context } = this.state;
    const { t, loginError } = this.props;

    const keyValid = this.mKeyValidation.test(apiKeyInput);

    return (
      <div className='login-content'>
        <Icon
          className='nexus-header'
          name='nexus-header'
          svgStyle='#login-dialog path { fill: black }'
        />
        <h3>
          {t('If you\'re having trouble logging in in the normal way, there is another option.')}
        </h3>
        {loginError === undefined ? null : (
          <Alert bsStyle='warning'>
            {loginError}
          </Alert>
        )}
        <ol style={{ textAlign: 'left' }}>
          <li>
            {t('Open the Nexus Mods page and log in if you\'re not already.')}
          </li>
          <li>
            {t('Open this url:')}
            {' '}<a onClick={this.openApiAccess}>{API_ACCESS_URL}</a>{' '}
          </li>
          <li>
            {t('If there is a button "REQUEST AN API KEY" button alongside '
              + '"Vortex", click it.')}
          </li>
          <li>
            {t('You should now see a text field alongside Vortex with a long series of seemingly '
             + 'random characters (your API Key) with three buttons below it. '
             + 'Of these buttons, click the right-most one (Copy API Key).')}
          </li>
          <li>
            <FormGroup controlId='' validationState={keyValid ? null : 'error'}>
              <FormControl
                componentClass='textarea'
                style={{display: 'inline', verticalAlign: 'top', height: '6em', resize: 'none'}}
                placeholder={t('Paste that api key into this input field')}
                value={apiKeyInput}
                onChange={this.updateAPIKey}
                onContextMenu={this.onShowContext}
                draggable={false}
              />
              <ContextMenu
                instanceId='login-context'
                visible={context !== undefined}
                position={context}
                onHide={this.onHideContext}
                actions={[
                  { title: t('Paste'), action: this.handlePaste, show: true },
                ]}
              />
              <FormFeedback />
              {keyValid ? null : <ControlLabel>{t('Invalid key')}</ControlLabel>}
            </FormGroup>
          </li>
          <li>
            {t('Then press')}
            {' '}
            <Button
              onClick={this.applyKey}
              tooltip={t('Save API Key')}
              // disabled={!keyValid}
            >
              {t('Save')}
            </Button>
          </li>
        </ol>
      </div>
    );
  }

  private onShowContext = (event: React.MouseEvent<any>) => {
    const modalDom = findDOMNode(this.mModalRef.current) as Element;
    const rect: DOMRect = modalDom.getBoundingClientRect() as DOMRect;
    this.nextState.context = { x: event.clientX - rect.x, y: event.clientY - rect.y };
  }

  private onHideContext = () => {
    this.nextState.context = undefined;
  }

  private handlePaste = () => {
    this.nextState.apiKeyInput = clipboard.readText();
    this.nextState.context = undefined;
  }

  private renderConfirmDialog() {
    return this.context.api.showDialog('question', 'Login incomplete', {
      text: 'Vortex is not logged in yet, are you sure you wish to abort the login process?',
    }, [
      { label: 'Cancel' },
      { label: 'Abort Login', action: () => {
        this.hide();
      } },
    ]);
  }

  private openApiAccess = () => {
    opn(API_ACCESS_URL).catch(() => null);
  }

  private hide = () => {
    const { onCancelLogin, onHide } = this.props;
    onCancelLogin();
    onHide();
  }

  private updateAPIKey = (evt: any) => {
    this.nextState.apiKeyInput = evt.target.value;
  }

  private applyKey = () => {
    const { apiKeyInput } = this.state;
    const { onHide, onResetLoginId, onSetAPIKey } = this.props;
    onSetAPIKey(apiKeyInput);
    onResetLoginId();
    onHide();
  }

  private close = () => {
    const { loginId } = this.props;
    // only request confirmation if the login has actually been started!
    if (loginId === undefined) {
      this.hide();
      return;
    }
    this.renderConfirmDialog().catch(err => {
      log('error', 'failed to show dialog', err.message);
    });
  }

  private troubleshoot = () => {
    this.nextState.troubleshoot = true;
  }

  private copyToClipboard = () => {
    try {
      clipboard.writeText(getPageURL(this.props.loginId));
    } catch (err) {
      // apparently clipboard gets lazy-loaded and that load may fail for some reason
      this.context.api.showErrorNotification('Failed to access clipboard',
                                             err, { allowReport: false });
    }
  }

  private login = () => {
    const { onHide } = this.props;
    this.nextState.requested = true;
    this.context.api.events.emit('request-nexus-login', (err: Error) => {
      this.nextState.requested = false;
      if ((err !== null) && !(err instanceof UserCanceled)) {
        this.context.api.showErrorNotification(
          'Failed to get access key', err, { id: 'failed-get-nexus-key', allowReport: false });
      }
      onHide();
    });
  }
}

function mapStateToProps(state: any): IConnectedProps {
  return {
    userInfo: state.persistent.nexus.userInfo,
    loginId: state.session.nexus.loginId || undefined,
    loginError: state.session.nexus.loginError || undefined,
  };
}

function mapDispatchToProps(dispatch: ThunkDispatch<any, null, Redux.Action>): IActionProps {
  return {
    onSetAPIKey: (APIKey: string) => dispatch(setUserAPIKey(APIKey)),
    onShowLoginError:
    (message: string) => dispatch(showDialog('error', 'Error', { message },
                                             [ { label: 'Close' } ])),
    onResetLoginId: () => dispatch(setLoginId(undefined)),
  };
}

export default
  translate(['common'])(
    connect(mapStateToProps, mapDispatchToProps)(
      LoginDialog)) as React.ComponentClass<IBaseProps>;
