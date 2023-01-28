import { IState } from '../../types/IState';

import { createSelector } from 'reselect';

export const apiKey = (state: IState) => state?.confidential?.account?.nexus?.APIKey;

export const isLoggedIn = (state: IState) => {
  const APIKEY = state.confidential.account['nexus']?.APIKey;
  const OAuthCredentials = state.confidential.account['nexus']?.OAuthCredentials;
  return (!!APIKEY) || (!!OAuthCredentials);
};
