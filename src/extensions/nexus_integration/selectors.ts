import { IState } from '../../types/IState';

export const apiKey = (state: IState) => state.confidential.account.nexus.APIKey;
