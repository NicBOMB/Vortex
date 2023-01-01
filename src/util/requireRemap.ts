
const Module = require('module');

import * as path from 'path';
import * as electron from './electron';
import * as libxmljs from './libxmljs';

// when spawning a binary, the code doing the spawning will be baked by webpack
// in release builds and thus reside in the app.asar file.
// The binaries being spawned however have to be unpacked, so if the path being spawned
// includes something like __dirname we have to update that path to work.
class ChildProcessProxy {
  public get(target, key: PropertyKey): any {
    if (key === '__isProxied') {
      return true;
    } else if (key === 'spawn') {
      return (command: string, ...args) => {
        const appAsar = `${path.sep}app.asar${path.sep}`;
        command = command.replace(appAsar, `${path.sep}app.asar.unpacked${path.sep}`);
        return target.spawn(command, ...args);
      };
    } else {
      return target[key];
    }
  }
}

function patchedLoad(orig) {

  return function anon(request: string, parent, ...rest) {
    if ((request === 'fs')
        && ((parent.filename.indexOf('graceful-fs') !== -1)
            || (parent.filename.indexOf('rimraf') !== -1))) {
      request = 'original-fs';
    } else if (request === 'electron') {
      return electron;
    } else if ((request === '@electron/remote') && (process.type !== 'renderer')) {
      return undefined;
    } else if (request === 'libxmljs') {
      return libxmljs;
    }

    let res = orig.apply(anon, [request, parent, ...rest]);

    if ((request === 'child_process') && !res.__isProxied) {
      res = new Proxy(res, new ChildProcessProxy());
    }

    return res;
  };
}

export default function() {
  const orig = (Module as any)._load;
  (Module as any)._load = patchedLoad(orig);
  return () => {
    (Module as any)._load = orig;
  };
}
