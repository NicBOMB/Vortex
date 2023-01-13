// @ts-check
const fs = require('fs');
const checker = require('license-checker');
const path = require('path');

checker.init(
  {
    start: './app',
    customPath: './licenseFormat.json',
    relativeLicensePath: true,
    production: true
  },
  function (err, json) {
    if (err){ return console.error('error', err); }

    const filtered = Object.entries(json).reduce((prev, [key, value]) => {
      if (key === ""
        || value.publisher?.startsWith?.('Black Tree Gaming')
        || key.startsWith('@types')
      ){
        console.log(`skipping module "${key}"`);
        return prev;
      }
      if (value.name === ""){ delete value.name; }
      if (value.version === ""){ delete value.version; }
      if (value.description === ""){ delete value.description; }
      if (value.repository === ""){ delete value.repository; }
      if (value.publisher === ""){ delete value.publisher; }
      if (value.email === ""){ delete value.email; }
      if (value.url === ""){ delete value.url; }
      if (value.licenses === ""){ delete value.licenses; }
      if (value.licenseFile === ""){ delete value.licenseFile; }
      delete value.licenseText;
      delete value.licenseModified;
      delete value.private;
      delete value.path;
      if (value.copyright === ""){ delete value.copyright; }
      if (value.noticeFile === ""){ delete value.noticeFile; }
      prev[key] = {
        ...value,
        licenseFile: value.licenseFile ?
          value.licenseFile.split(path.sep).slice(1) :
          undefined
      };
      return prev;
    }, {});

    fs.writeFile(
      path.join('assets', 'modules.json'),
      JSON.stringify(filtered, undefined, 2),
      { encoding: 'utf-8' },
      () => null
    );
  });
