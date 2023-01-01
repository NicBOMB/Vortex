import { IProfile } from './types/IProfile';

import createCachedSelector from 're-reselect';
import { createSelector } from 'reselect';
import { IState } from '../../types/IState';

const profilesBase = (state: IState) => state.persistent.profiles;
const lastActiveProfiles = (state: IState) => state.settings.profiles.lastActiveProfile;

export const activeGameId = (state: IState): string => {
  const profile = activeProfile(state);
  return profile.gameId;
};

export const gameProfiles =
    createSelector(activeGameId, profilesBase,
                   (gameId: string, profiles: {[id: string]: IProfile}) => {
                     return Object.keys(profiles)
                         .filter((id: string) => profiles[id].gameId === gameId)
                         .map((id: string) => profiles[id]);
                   });

export const activeProfile = (state: IState): IProfile => {
  return state.persistent.profiles[state.settings.profiles.activeProfileId];
};

const profileByIdImpl = createCachedSelector(
  profilesBase,
  (state: IState, profileId: string) => profileId,
  (profilesBaseIn: { [profileId: string]: IProfile }, profileId: string) =>
    profilesBaseIn[profileId])((state: IState, profileId: string) => profileId);

export function profileById(state: IState, profileId: string) {
  if (profileId === undefined) {
    return undefined;
  }

  return profileByIdImpl(state, profileId);
}

export const lastActiveProfileForGame = createCachedSelector(
  lastActiveProfiles,
  (state: IState, gameId: string) => gameId,
  (lastActiveProfilesIn: { [gameId: string]: string }, gameId: string) =>
    lastActiveProfilesIn[gameId])((state: IState, gameId: string) => gameId);
