// @ts-ignore fewer imports in typings
import * as reduxAct from 'redux-act';
import safeCreateAction from '../../../actions/safeCreateAction';

/*
 * action to set the user API Key. Takes one parameter, the api key as a string
 */
export const setUserAPIKey = safeCreateAction(
    'SET_USER_API_KEY',
    (key) => key
);

export const clearOAuthCredentials = safeCreateAction(
    'CLEAR_OAUTH_CREDENTIALS',
    () => null
);

export const setOAuthCredentials = safeCreateAction(
    'SET_OAUTH_CREDENTIALS',
    (token: string, refreshToken: string, fingerprint: string) => (
        { token, refreshToken, fingerprint }
    )
);
