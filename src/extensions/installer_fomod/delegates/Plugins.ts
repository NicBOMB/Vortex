import { IExtensionApi } from '../../../types/IExtensionContext';
import DelegateBase from './DelegateBase';

class Plugins extends DelegateBase {
  constructor(api: IExtensionApi) {
    super(api);
  }

  public isActive =
      (pluginName: string, callback: (err, res: boolean) => void) => {
        try {
          const state = this.api.store.getState();

          const pluginList = state.session.plugins?.pluginList ?? {};

          const plugins = Object.keys(pluginList);
          return callback(null, this.isEnabled(state, pluginList, plugins, pluginName));
        } catch (err) {
          return callback(err, false);
        }
      }

  public isPresent =
      (pluginName: string, callback: (err, res: boolean) => void) => {
        try {
          const state = this.api.store.getState();

          const plugins = Object.keys(state?.session?.plugins?.pluginList ?? {});
          const localName = plugins.find((plugin) => plugin.toLowerCase() === pluginName.toLowerCase());

          return callback(null, localName !== undefined);
        } catch (err) {
          return callback(err, false);
        }
      }

  public getAll = (isActiveOnly: boolean, callback: (err, res: string[]) => void) => {
    try {
      const state = this.api.store.getState();

      const pluginList = state.session.plugins?.pluginList ?? {};
      let plugins = Object.keys(pluginList);

      if (isActiveOnly === true) {
        plugins = plugins.filter(name => this.isEnabled(state, pluginList, plugins, name));
      }
      return callback(null, plugins);
    } catch (err) {
      return callback(err, null);
    }
  }

  private isEnabled(state: any, pluginList: any, plugins: string[], pluginName: string) {
    const localName = plugins.find(plugin =>
      plugin.toLowerCase() === pluginName.toLowerCase());
    if (localName === undefined) {
      // unknown plugin can't be enabled
      return false;
    }
    return pluginList[localName].isNative
      || (state.loadOrder?.[localName]?.enabled ?? false);
  }
}

export default Plugins;
