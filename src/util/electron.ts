import * as remoteT from '@electron/remote';
import * as electron from 'electron';

const myExport: typeof electron & { remote?: typeof remoteT } = {
  ...electron,
};

module.exports = myExport;

if (process.type === 'renderer') {

  module.exports['remote'] = require('@electron/remote');
}
