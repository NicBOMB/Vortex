import { RedownloadMode } from '../DownloadManager';
import { IChunk } from './IChunk';

export type DownloadState = 'init' | 'started' | 'paused' | 'finalizing' | 'finished' | 'failed' | 'redirect';

export interface IDownloadFailCause {
  htmlFile?: string;
  message?: string;
}

export interface IDownloadOptions {
  referer?: string;
  redownload?: RedownloadMode;
  // If available, will contain the user-friendly name of the mod. Will only be used in messages
  // to the user
  nameHint?: string;
}

/**
 * download information
 *
 * @export
 * @interface IDownload
 */
export interface IDownload {
  /**
   * current state of the download
   */
  state: DownloadState;

  /**
   * if the download failed, this will contain a more detailed description
   * of the error
   */
  failCause?: IDownloadFailCause;

  /**
   * list of urls we know serve this file. Should be sorted by preference.
   * If download from the first url isn't possible, the others may be used
   */
  urls: string[];

  /**
   * path of the file being downloaded to. This is relative to the base download
   * directory for the game and since we use a flat directory structure, this is
   * in practice just the file name
   */
  localPath?: string;

  /**
   * id of the game(s) to which this archive is compatible.
   */
  game: string[];

  /**
   * info about the mod being downloaded. This will
   * be associated with the mod entry after its installation
   */
  modInfo: { [key: string]: any };

  /**
   * id of the (last) mod installed from this archive. Will be undefined
   * while the archive is not installed. This will not be unset if the
   * mod is uninstalled, so to determine if the archive is actually installed
   * one has to look at the dictionary of installed mods
   */
  installed?: { gameId: string, modId: string };

  /**
   * hash of the file data
   */
  fileMD5?: string;

  /**
   * MS timestamp the download was started
   */
  startTime: number;

  /**
   * MS timestamp the file finished downloading
   */
  fileTime: number;

  /**
   * size in bytes
   */
  size: number;

  /**
   * number of bytes received so far
   */
  received: number;

  /**
   * number of bytes hashed during finalizing
   */
  verified: number;

  /**
   * for paused downloads, this contains the list segments that are still missing
   */
  chunks?: IChunk[];

  /**
   * whether the download server supports resuming downloads
   */
  pausable?: boolean;
}
