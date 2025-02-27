import { IReducerSpec } from '../../../types/IExtensionContext';
import { deleteOrNop, merge, setSafe } from '../../../util/storeHelper';
import * as actions from '../actions/settings';

import * as _ from 'lodash';
import { IDiscoveredTool } from '../../../types/IDiscoveredTool';

/**
 * reducer for changes to the window state
 */
export const settingsReducer: IReducerSpec = {
  reducers: { // FIXME: remove as any from all of these to see the problems
    [actions.addDiscoveredGame as any]: (state, payload) => {
      // don't replace previously discovered games as the settings
      // there may also be user configuration
      const res = merge(state, ['discovered', payload.id], payload.result);
      const merged = res?.discovered?.[payload.id];
      if (merged.executable === undefined) {
        // work around a problem where a value of undefined will be picked up as a
        // difference to the value not being set at all which triggered a change to be detected
        // every startup
        delete merged.executable;
      }
      if ((payload.path !== undefined) && (payload.store === undefined)) {
        // new path set but no store? fall back to default
        res.store = undefined;
      }

      // avoid triggerring unnecessary events
      if (_.isEqual(res?.discovered?.[payload.id], state?.discovered[payload.id])){
        return state;
      } else {
        return res;
      }
    },
    [actions.clearDiscoveredGame as any]: (state, payload) => {
      const { id } = payload;
      // if the path was set manually, reset that as well
      state = deleteOrNop(state, ['discovered', id, 'pathSetManually']);
      return deleteOrNop(state, ['discovered', id, 'path']);
    },
    [actions.setGamePath as any]: (state, payload) => {
      const input = {
        path: payload.gamePath,
        pathSetManually: payload.gamePath !== undefined,
        store: payload.store,
      };
      if (payload.exePath !== undefined) {
        input['executable'] = payload.exePath;
      }
      return merge(state, ['discovered', payload.gameId], input);
    },
    [actions.addDiscoveredTool as any]: (state, payload) => {
      if (state.discovered[payload.gameId] === undefined) {
        return state;
      }

      // executable is a function. this shouldn't have been included in the first place but it's
      // easier to fix here
      // delete payload.result.executable;

      const old: IDiscoveredTool = _.omit(state?.discovered?.[payload.gameId]?.tools?.[payload.toolId], ['timestamp']);
      if (!payload.manual) {
        if (_.isEqual(old, payload.result)) {
          return state;
        }
      }

      return setSafe(
        state, ['discovered', payload.gameId, 'tools', payload.toolId],
        {
          ...payload.result,
          hidden: payload.hidden || old.hidden,
          timestamp: Date.now(),
        });
    },
    [actions.setToolVisible as any]: (state, payload) =>
      // custom added tools can be deleted so we do that instead of hiding them
      (!payload.visible
       && (state?.discovered?.[payload.gameId]?.tools?.[payload.toolId]?.custom ?? false))
        ? deleteOrNop(state, ['discovered', payload.gameId, 'tools', payload.toolId])
        : setSafe(state, ['discovered', payload.gameId, 'tools', payload.toolId, 'hidden'],
                  !payload.visible),
    [actions.setGameParameters as any]: (state, payload) =>
      (state.discovered[payload.gameId] === undefined)
        ? state
        : merge(state, ['discovered', payload.gameId], payload.parameters),
    [actions.setGameHidden as any]: (state, payload) =>
      setSafe(state, ['discovered', payload.gameId, 'hidden'], payload.hidden),
    [actions.setGameSearchPaths as any]: (state, payload) =>
      setSafe(state, ['searchPaths'], payload),
    [actions.setPickerLayout as any]: (state, payload) =>
      setSafe(state, ['pickerLayout'], payload.layout),
    [actions.setSortManaged as any]: (state, payload) => setSafe(state, ['sortManaged'], payload),
    [actions.setSortUnmanaged as any]: (state, payload) =>
      setSafe(state, ['sortUnmanaged'], payload),
  },
  defaults: {
    discovered: {},
    searchPaths: [],
    pickerLayout: 'small',
    sortManaged: 'alphabetical',
    sortUnmanaged: 'alphabetical',
  },
};
