import minimatch from 'minimatch';
import * as semver from 'semver';
import { ISurveyInstance, IAnnouncement } from './types';

export function matchesGameMode (entry: IAnnouncement|ISurveyInstance,
                                   gameMode: string,
                                   forceMatch: boolean = false): boolean {
  const entryGameMode = entry?.gamemode;
  if ((gameMode === undefined)
    && ((entryGameMode === undefined) || (entryGameMode === '*'))) {
    return true;
  }

  return ((entryGameMode !== undefined) && (gameMode !== undefined))
  // Only compare gameModes when the entry is game specific and
  //  we have an active game mode. We use forceMatch at this point as
  //  we don't want to display announcements if the predicate fails, but
  //  we _do_ want to display surveys, so this allows us to keep the same
  //  predicate for both use cases. (bit hacky I admit..)
    ? minimatch(gameMode, entryGameMode)
    : forceMatch;
}

export function matchesVersion (entry: IAnnouncement|ISurveyInstance, appVersion: string): boolean {
  const entryVersion = entry?.version;
  return (entryVersion !== undefined)
    ? semver.satisfies(appVersion, entryVersion)
    : true;
}
