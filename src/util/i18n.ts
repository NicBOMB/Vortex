import { IExtension } from '../extensions/extension_manager/types';

import * as fs from './fs';
import { log } from './log';
import getVortexPath from './getVortexPath';

import I18next, { i18n, PostProcessorModule, BackendModule, Services, TOptions, TFunction } from 'i18next';
import FSBackend from 'i18next-fs-backend';
import * as path from 'path';
import { initReactI18next } from 'react-i18next';

let debugging = false;
let currentLanguage = 'en';
const fallbackTFunc: TFunction = (str) => (
  Array.isArray(str) ? str[0].toString() : str.toString()
);

let actualT: TFunction = fallbackTFunc;

export { fallbackTFunc, i18n, TFunction };

let missingKeys = { common: {} };

export interface IInitResult {
  i18n: i18n;
  tFunc: TFunction;
  error?: Error;
}

type BackendType = 'bundled' | 'custom' | 'extension';

class MultiBackend implements BackendModule {
  public type: BackendModule["type"] = "backend";
  private mServices: Services;
  private mOptions: object;
  private mCurrentBackend?: FSBackend;
  private mLastReadLanguage?: string;
  private mBackendType?: BackendType;

  constructor (services: Services, options: object){
    this.mServices = services;
    this.mOptions = options;
    log('info', 'i18n Backend Options', options);
  }

  public init: BackendModule['init'] = (services, options) => {
    this.mServices = services;
    this.mOptions = options;
    log('info', 'i18n Backend Options', options);
  }

  public read: BackendModule['read'] = (language, namespace, callback) => {
    const {backendType, extPath} = this.backendType(language);
    if (backendType !== this.mBackendType ||
      (backendType === 'extension' && language !== this.mLastReadLanguage)
    ){
      this.mCurrentBackend = this.initBackend(backendType, extPath);
    }

    this.mLastReadLanguage = language;
    this.mCurrentBackend?.read?.(language, namespace, callback);
  }

  private initBackend (type: BackendType, extPath: string){
    const res = new FSBackend();

    const basePath =
    (type === 'bundled') ? this.mOptions.bundled :
    (type === 'custom') ? this.mOptions.user :
    extPath;

    res.init(this.mServices, {
      loadPath: path.join(basePath, '{{lng}}', '{{ns}}.json'),
      addPath: path.join(basePath, '{{lng}}','{{ns}}.missing.json')
    });

    this.mBackendType = type;

    return res;
  }

  private backendType(language: string): { backendType: BackendType, extPath?: string } {
    try {
      // translations from the user directory (custom installs or in-development)
      fs.statSync(path.join(this.mOptions.user, language));
      return { backendType: 'custom' };
    } catch (err) {
      // extension-provided
      const ext = this.mOptions.translationExts().find((iter: IExtension) => {
        try {
          fs.statSync(path.join(iter.path, language));
          return true;
        } catch (err) {
          return false;
        }
      });
      if (ext !== undefined) {
        return { backendType: 'extension', extPath: ext.path };
      }

      try {
        // finally, see if we have the language bundled
        fs.statSync(path.join(this.mOptions.bundled, language));
        return { backendType: 'bundled' };
      } catch (err) {
        return { backendType: 'custom' };
      }
    }
  }
}

class HighlightPP implements PostProcessorModule {
  public name: PostProcessorModule['name'] = 'HighlightPP';
  public type: PostProcessorModule['type'] = 'postProcessor';

  constructor() {}

  public process: PostProcessorModule['process'] = (value: string, key, options, translator) => {
    if (value.startsWith('TT:')) {
      console.trace('duplicate translation', key, value);
    }
    return 'TT:' + value.toUpperCase();
  }
}

/**
 * initialize the internationalization library
 */
function init(language: string, translationExts: () => IExtension[]): Promise<IInitResult> {
  // reset to english if the language isn't valid
  try {
    new Date().toLocaleString(language);
  } catch {
    language = 'en';
  }

  currentLanguage = language;

  if (process.env['HIGHLIGHT_I18N'] === 'true') {
    I18next.use(new HighlightPP());
  }
  I18next.use(MultiBackend).use(initReactI18next);

  return new Promise((resolve, reject) => I18next.init({
      fallbackLng: 'en',
      fallbackNS: 'common',
      ns: ['common'],
      defaultNS: 'common',
      nsSeparator: ':::',
      keySeparator: '::',
      debug: false,
      postProcess: ((process.env['HIGHLIGHT_I18Nlng'] === 'true') ? 'HighlightPP' : false),
      react: { useSuspense: false },
      saveMissing: debugging,
      saveMissingTo: 'current',
      missingKeyHandler: (
        lngs,
        ns,
        key,
        fallbackValue
      ) => {
        if (missingKeys[ns] === undefined) {
          missingKeys[ns] = {};
        }
        missingKeys[ns][key] = key;
      },
      interpolation: { escapeValue: false },
      backend: {
        bundled: getVortexPath('locales'),
        user: path.normalize(path.join(getVortexPath('userData'), 'locales')),
        translationExts
      }
    }, (err, t) => {
      if (err){
        reject({
          i18n: I18next,
          tFunc: actualT = fallbackTFunc,
          err
        });
      } else {
        resolve({
          i18n: I18next,
          tFunc: actualT = t
        });
      }
    }
  ));
}

export function getCurrentLanguage() {
  return currentLanguage;
}

export function changeLanguage(lng: string, cb?: (err: Error) => void): Promise<TFunction> {
  currentLanguage = lng;
  return I18next.changeLanguage(lng, cb);
}

export function globalT(key: string | string[], options: TOptions) {
  return actualT(key, options);
}

export function debugTranslations(enable?: boolean) {
  debugging = (enable !== undefined)
    ? enable
    : !debugging;
  missingKeys = { common: {} };
  init(I18next.language, () => []);
}

export function getMissingTranslations() {
  return missingKeys;
}

export interface ITString {
  key: string;
  options?: TOptions;
  toString(): string;
}

export class TString implements ITString {
  private mKey: string;
  private mOptions: TOptions;

  constructor(key: string, options: TOptions|undefined, namespace: string) {
    this.mKey = key;
    this.mOptions = options ?? {};
    if (this.mOptions.ns === undefined) {
      this.mOptions.ns = namespace;
    }
  }

  public get key (): string {
    return this.mKey;
  }

  public get options (): TOptions {
    return this.mOptions;
  }

  public toString (): string {
    return this.mKey;
  }
}

export const laterT: TFunction =
  (key: string, optionsOrDefault?: TOptions | string, options?: TOptions): ITString => {
    if (typeof(optionsOrDefault) === 'string') {
      return new TString(key, options, 'common');
    } else {
      return new TString(key, optionsOrDefault, 'common');
    }
  };

/**
 * translate an input string. If key is a string or string array, this just
 * forwards the parameters to the t function.
 * If it is an ITString object, will translate using with the parameters stored
 * within
 * @param t the actual translation function to invok
 * @param key translation key, keys or ITString object
 * @param options translations options. this will take precedence over those specified at
 *                the time the ITString was created
 * @param onlyTString if set to true and the key is a string, assume it's already the translated
 *                    string and don't translate again. This is mostly for backwards compatibility
 */
export function preT(t: TFunction,
                     key: string | string[] | ITString,
                     options?: TOptions,
                     onlyTString?: boolean) {
  if (typeof(key) === 'string') {
    if (onlyTString === true) {
      return key;
    } else {
      return t(key, options);
    }
  } else if (Array.isArray(key)) {
    return t(key, options);
  } else {
    return t(key.key, { ...key.options, ...(options ?? {}) });
  }
}

export default init;
