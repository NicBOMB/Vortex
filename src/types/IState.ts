import { IAttributeState } from './IAttributeState';
import { IDialog } from './IDialog';
import { INotification } from './INotification';
import { ISurveyInstance } from '../extensions/announcement_dashlet/types';
import { LoadOrder, ILoadOrderEntry } from '../extensions/file_based_loadorder/types/types';
import { IItemRendererOptions } from '../extensions/mod_load_order/types/types';
import { ICategoryDictionary } from '../extensions/category_management/types/ICategoryDictionary';
import { IDownload } from '../extensions/download_management/types/IDownload';
import { IAvailableExtension, IExtension } from '../extensions/extension_manager/types';
import { IInstallerState } from '../extensions/installer_fomod/types/interface';
import { IDiscoveryResult } from '../extensions/gamemode_management/types/IDiscoveryResult';
import { IGameStored } from '../extensions/gamemode_management/types/IGameStored';
import { IHistoryPersistent, IHistoryState } from '../extensions/history_management/reducers';
import { IMod } from '../extensions/mod_management/types/IMod';
import { IProfile } from '../extensions/profile_management/types/IProfile';
import { IParameters } from '../util/commandLine';
import VortexInstallType from './VortexInstallType';
import { EndorsedStatus, ICollection, IRevision } from '@nexusmods/nexus-api';
import { IServer } from 'modmeta-db';

// re-export these to keep the imports from extensions local
export { IDownload, IDiscoveryResult, IGameStored, IMod, IProfile, LoadOrder, ILoadOrderEntry };

/** interface to represent a position on the screen */
export interface IPosition {
  x: number;
  y: number;
}

/** interface to represent pixel-dimensions on the screen */
export interface IDimensions {
  height: number;
  width: number;
}

/** interface for window state */
export interface IWindow {
  maximized: boolean;
  position?: IPosition;
  size: IDimensions;
  tabsMinimized: boolean;
  customTitlebar: boolean;
  minimizeToTray: boolean;
}

/** state regarding all manner of user interaction */
export interface INotificationState {
  notifications: INotification[];
  dialogs: IDialog[];
}

export interface IExtensionLoadFailure {
  id: string;
  args?: { [key: string]: any };
}

export interface IProgress {
  text: string;
  percent: number;
}

export interface IRunningTool {
  started: number;
  exclusive: boolean;
  pid: number;
}

export interface IUIBlocker {
  icon: string;
  description: string;
  mayCancel: boolean;
}

/**
 * "ephemeral" session state.
 * This state is generated at startup and forgotten at application exit
 */
export interface ISession {
  displayGroups: { [id: string]: string };
  overlayOpen: boolean;
  visibleDialog: string;
  mainPage: string;
  secondaryPage: string;
  activity: {
    mods: string[]
    // FIXME: missing {dependencies?: []} type
  };
  progress: { [group: string]: { [id: string]: IProgress } };
  settingsPage: string;
  extLoadFailures: { [extId: string]: IExtensionLoadFailure[] };
  toolsRunning: { [exeId: string]: IRunningTool };
  uiBlockers: { [id: string]: IUIBlocker };
  networkConnected: boolean;
  commandLine: IParameters;
}

export interface IRowState {
  selected: boolean;
  highlighted: boolean;
}

export interface ITableState {
  attributes: { [id: string]: IAttributeState };
  rows: { [id: string]: IRowState };
  groupBy?: string;
  filter?: { [id: string]: any };
  collapsedGroups?: string[];
}

export interface IExtensionState {
  enabled: boolean | 'failed';
  version: string;
  remove: boolean;
  endorsed: EndorsedStatus;
}

/** settings relating to the vortex application itself */
export interface IApp {
  instanceId: string;
  name: 'vortex'|'vortex_devel';
  version: string;
  appVersion: string;
  extensions: { [id: string]: IExtensionState };
  warnedAdmin: number;
  installType: VortexInstallType;
  migrations: string[];
}

/**
 * settings relating to the user (os account) personally
 * even in a multi-user environment
 */
export interface IUser {
  multiUser: boolean;
}

export interface ITableStates {
  [id: string]: ITableState;
}

export interface IStateDownloads {
  speed: number;
  speedHistory: number[];
  files: { [id: string]: IDownload };
}

export interface IDashletSettings {
  enabled: boolean;
  width: number;
  height: number;
  fixed: boolean;
}

export interface ISettingsInterface {
  language: string;
  advanced: boolean;
  profilesVisible: boolean;
  desktopNotifications: boolean;
  hideTopLevelCategory: boolean;
  relativeTimes: boolean;
  dashboardLayout: string[];
  foregroundDL: boolean;
  dashletSettings: { [dashletId: string]: IDashletSettings };
  usage: { [usageId: string]: boolean };
  primaryTool: { [gameMode: string]: '' };
  tools:{ order: { [gamemode: string]: string[]}; };
}

export interface ISettingsAutomation {
  deploy: boolean;
  install: boolean;
  enable: boolean;
  start: boolean;
  minimized: boolean;
}

export interface ISettingsProfiles {
  activeProfileId: string;
  nextProfileId: string;
  lastActiveProfile: { [gameId: string]: string };
}

export interface ISettingsGameMode {
  discovered: { [id: string]: IDiscoveryResult };
  searchPaths: string[];
  pickerLayout: 'list' | 'small' | 'large';
  sortManaged: string;
  sortUnmanaged: string;
}

export interface ISettingsDownloads {
  minChunkSize: number;
  maxChunks: number;
  maxParallelDownloads: number;
  maxBandwidth: number;
  path: string;
  showDropzone: boolean;
  showGraph: boolean;
  copyOnIFF: boolean;
}

export interface IStatePaths {
  base: string;
  download: string;
  install: string;
}

export type InstallPathMode = 'userData' | 'suggested';

export interface ISettingsMods {
  installPath: { [gameId: string]: string };
  modlistState: { [id: string]: IAttributeState };
  activator: { [gameId: string]: string };
  installPathMode: InstallPathMode;
  suggestInstallPathDirectory: string;
  showDropzone: boolean;
  confirmPurge: boolean;
  cleanupOnDeploy: boolean;
  installerSandbox: boolean;
}

export interface IMetaServer {
  servers: {[key: string]: IServer}
}

export interface ISettingsNotification {
  suppress: { [notificationId: string]: boolean };
}

export const UPDATE_CHANNELS = ['stable', 'beta', 'next', 'none'] as const;

type ValuesOf<T extends readonly any[]>= T[number];

export type UpdateChannel = ValuesOf<typeof UPDATE_CHANNELS>;

export interface ISettingsUpdate {
  channel: UpdateChannel;
}

export interface ISettingsWorkarounds {
  userSymlinks: boolean;
}

export interface ISettings {
  analytics: {
      enabled: boolean
  }
  interface: ISettingsInterface;
  automation: ISettingsAutomation;
  gameMode: ISettingsGameMode;
  profiles: ISettingsProfiles;
  window: IWindow;
  downloads: ISettingsDownloads;
  loadOrder: {
    rendererOptions: IItemRendererOptions
  };
  mods: ISettingsMods;
  metaserver: IMetaServer;
  nexus: {
    associateNXM: boolean;
  }
  notifications: ISettingsNotification;
  tables: ITableStates;
  update: ISettingsUpdate;
  workarounds: ISettingsWorkarounds;
}

export interface IStateTransactions {
  transfer: {
    downloads: string;
  };
}

export interface ISessionGameMode {
  known: IGameStored[];
  addDialogVisible: boolean;
  disabled: { [gameId: string]: string };
}

export interface IGameInfoEntry {
  key: string;
  provider: string;
  priority: number;
  expires: number;
  title: string;
  value: any;
  type?: string;
}

export interface IStateGameMode {
  gameInfo: {
    [gameId: string]: {
      [key: string]: IGameInfoEntry,
    },
  };
}

export interface IBrowserState {
  url: string;
  instructions: string;
  subscriber: string;
  skippable: boolean;
}

export interface IModTable {
  [gameId: string]: {
    [modId: string]: IMod;
  };
}

export interface IOverlay {
  title: string;
  content: string | React.ComponentType<any>;
  position: IPosition;
  options?: IOverlayOptions;
}

export interface IOverlayOptions {
  containerTitle?: string;
  showIcon?: boolean;
  className?: string;
  disableCollapse?: boolean;
  id?: string;
  props?: any;
}

export interface IOverlaysState {
  overlays: { [key: string]: IOverlay };
}

export interface ISurveys {
  available: [ISurveyInstance];
}

export interface IExtensionsState {
  available: IAvailableExtension[],
  installed: { [extId: string]: IExtension },
  updateTime: number,
}

/**
 * generic information about a plugin
 */
export interface IPlugin {
  /**
   * name of the mod that installed this plugin
   * may be undefined if this plugin was not installed with Vortex
   *
   * @type {string}
   * @memberOf IPlugin
   */
  modId?: string;
  /**
   * path to the plugin on disk
   */
  filePath: string;
  /**
   * specifies whether this is a "native" plugin, that is: One
   * where the load order is hard-coded into the game engine so
   * we have no influence on if/when it is loaded.
   *
   * @type {boolean}
   * @memberOf IPlugin
   */
  isNative: boolean;

  /**
   * Specifies whether this plugin has any warning which it
   * wishes to bring to the user's attention. Will add a warning
   * icon under plugin flags.
   */
  warnings?: {[key: string]: boolean};

  /**
   * true if the plugin is currently deployed
   */
  deployed?: boolean;
}

export interface IPlugins { [key: string]: IPlugin; }

export interface IPluginDependencies {
  connection: {
    target: {
      id: string,
    },
  };
  dialog: IDialog;
  quickEdit: {
    plugin: string,
    mode: string,
  };
  groupEditorOpen: boolean;
}

export interface ISessionState {
  base: ISession;
  collections: {
    modId: string;
  };
  gameMode: ISessionGameMode;
  discovery: IDiscoveryState;
  notifications: INotificationState;
  browser: IBrowserState;
  history: IHistoryState;
  overlays: IOverlaysState;
  surveys: ISurveys;
  extensions: IExtensionsState;
  nexus: INexusInfo;
  fomod: {
    installer: {
      dialog:{
        state: IInstallerState
      }
    }
  },
  plugins: {
    pluginList: IPlugins;
  };
  pluginDependencies: IPluginDependencies;
}

export interface INexusUser {
  email: string;
  isPremium: boolean; //''|'Premium';
  isSupporter: boolean; //'Supporter'|'Member';
  name: string;
  profileUrl: string;
  userId: number;
}

export interface INexusInfo {
  freeUserDLQueue: string[];
  newestVersion: string;
  userInfo: INexusUser;
  lastUpdate: {};
}

export interface IPersistent {
    profiles: { [profileId: string]: IProfile };
    collections: {
      [collectionId: string]: {
        timestamp: number;
        info: ICollection;
      };
    };
    revisions: {
      [revisionId: string]: {
        timestamp: number;
        info: IRevision;
      };
    };
    changelogs: { changelogs: any[] };
    loadOrder: { [profileId: string]: LoadOrder };
    mods: IModTable;
    downloads: IStateDownloads;
    categories: { [gameId: string]: ICategoryDictionary };
    gameMode: IStateGameMode;
    deployment: { needToDeploy: { [gameId: string]: boolean } };
    transactions: IStateTransactions;
    surveys: {
      suppressed: { [id: string]: ISurveyInstance };
    }
    history: IHistoryPersistent;
    nexus: INexusInfo;
  }

export interface ILocalizedMessage {
  lang: string;
  str: string;
}

export interface IMessage {
  type: 'say' | 'warn' | 'error';
  content: string | ILocalizedMessage[];
  condition?: string;
  subs?: string[];
}

export interface IBashTag {
  name: string;
  condition?: string;
}

type BashTag = string | IBashTag;

export interface ILocation {
  link: string;
  // ver is deprecated anyway so not even implemented
}

export interface IDirtyInfo {
  crc: string;
  util: string;
  itm?: number;
  udr?: number;
  nav?: number;
}

export interface ILootReference {
  name: string;
  display: string;
  condition?: string;
}

export interface ILOOTPlugin {
  name: string;
  enabled?: boolean;
  group?: string;
  after?: Array<string | ILootReference>;
  req?: Array<string | ILootReference>;
  inc?: Array<string | ILootReference>;
  msg?: IMessage[];
  tag?: BashTag[];
  url?: ILocation[];
  dirty?: IDirtyInfo[];
}

export interface ILOOTGroup {
  name: string;
  after?: string[];
}

export interface ILOOTList {
  globals: IMessage[];
  plugins: ILOOTPlugin[];
  groups: ILOOTGroup[];
  // only used in the persistors to determine if the list has been loaded from disk
  __isLoaded?: boolean;
}

export interface ILoadOrder {
  name: string;
  enabled?: boolean | 'ghost';
  loadOrder?: number;
}

/** interface for the top-level state object */
export interface IState {
  app: IApp;
  user: IUser;
  masterlist: ILOOTList;
  userlist: ILOOTList;
  loadOrder: { [pluginId: string]: ILoadOrder };
  confidential: {
    account: {
      nexus: {
        APIKey: string,
      }
    },
  };
  session: ISessionState;
  settings: ISettings;
  persistent: IPersistent;
}

export interface IDiscoveryPhase {
  progress: number;
  directory: string;
}

/** the state of gamemode discovery */
export interface IDiscoveryState {
  running: boolean;
  phases: { [id: number]: IDiscoveryPhase };
}

/** gamemode-related application settings */
export interface IGameModeSettings {
}
