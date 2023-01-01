import * as semver from 'semver';
import { IMod, IReference } from '../types/IMod';
import { sanitizeExpression } from './testModReference';

export function makeModReference(mod: IMod): IReference {
  const fileName = mod.attributes['fileName'];

  return {
    fileExpression: (fileName !== undefined)
      ? sanitizeExpression(fileName)
      : mod.attributes['name'],
    fileMD5: mod.attributes['fileMD5'],
    versionMatch: semver.coerce(mod.attributes['version'])?.version ?? mod.attributes['version'],
    logicalFileName: mod.attributes['logicalFileName'],
  };
}
