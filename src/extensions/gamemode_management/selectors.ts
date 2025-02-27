import { IState } from '../../types/IState';
import { activeGameId } from '../../util/selectors';

import { IDiscoveryResult } from './types/IDiscoveryResult';
import { IGameStored } from './types/IGameStored';

import { SITE_ID } from './constants';

import createCachedSelector, /* @ts-ignore fewer imports in typings */
{ ICacheObject, OutputParametricSelector, ParametricSelector, ParametricKeySelector, OutputSelectorFields }
from 're-reselect'; // @ts-ignore fewer imports in typings
import { createSelector } from 'reselect';

export function knownGames(state: IState): IGameStored[] {
  return state.session.gameMode.known;
}

function discovered(state: IState): { [id: string]: IDiscoveryResult } {
  return state.settings.gameMode.discovered;
}

export const currentGame =
  createSelector(knownGames, activeGameId, (games, currentGameMode) =>
    games.find(game => game.id === currentGameMode),
    );

export const gameById =
  createCachedSelector(knownGames, (state: IState, gameId: string) => gameId, (games, gameId) =>
    games.find(game => game.id === gameId))((state, gameId) => gameId);

/**
 * return the discovery information about a game
 *
 * @export
 * @param {*} state
 * @returns {IDiscoveryResult}
 */
export function currentGameDiscovery(state: IState): IDiscoveryResult {
  const gameMode = activeGameId(state);
  return state.settings.gameMode.discovered[gameMode];
}

export const discoveryByGame =
  createCachedSelector(discovered,
    (state: IState, gameId: string) => gameId,
    (discoveredIn, gameId) => discoveredIn[gameId],
  )((state: IState, gameId) => gameId);

export function gameName(state: IState, gameId: string): string {
  if (gameId === SITE_ID) {
    return 'Tools & Extensions';
  }
  const fromDiscovery = state?.settings?.gameMode?.discovered?.[gameId]?.name;
  if (fromDiscovery !== undefined) {
    return fromDiscovery;
  }

  const known = (state.session.gameMode.known ?? []).find(game => game.id === gameId);
  if (known !== undefined) {
    return known.name;
  } else {
    return '';
  }
}
