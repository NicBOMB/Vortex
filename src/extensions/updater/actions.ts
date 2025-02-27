// @ts-ignore fewer imports in typings
import * as reduxAct from 'redux-act';
import safeCreateAction from '../../actions/safeCreateAction';

/**
 * changes the 'channel' from which to receive Vortex updates
 * currently either 'beta', 'stable' or 'none'
 */
export const setUpdateChannel = safeCreateAction('SET_UPDATE_CHANNEL', channel => channel);
