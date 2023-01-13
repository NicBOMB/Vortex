// @ts-ignore fewer imports in typings
import * as reduxAct from 'redux-act';
import safeCreateAction from '../../../actions/safeCreateAction';

export const setAutoDeployment = safeCreateAction('SET_AUTO_DEPLOYMENT', (deploy) => deploy);
export const setAutoInstall = safeCreateAction('SET_AUTO_INSTALL', (enabled) => enabled);
export const setAutoEnable = safeCreateAction('SET_AUTO_ENABLE', (enabled) => enabled);
export const setAutoStart = safeCreateAction('SET_AUTO_START', (start) => start);
export const setStartMinimized = safeCreateAction('SET_START_MINIMIZED', (minimized) => minimized);
