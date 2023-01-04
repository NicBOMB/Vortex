import { IDiscoveredTool } from '../../../types/IDiscoveredTool'

/**
 * cached information about games.
 * Don't trunst this, avoid using it as dynamic information
 *   (e.g. the executable) that might be affected by which variant of the
 *   game is discovered will not be correct
 */
export interface IGameStored {
  id: string;
  name: string;
  shortName?: string;
  logo?: string;
  extensionPath?: string;
  imageURL?: string;
  requiredFiles: string[];
  // cached value of IGame.executable. DO NOT USE! This will only be correct
  // if the  return value of executable() is independent of discovery information!
  executable: string;
  parameters?: string[];
  supportedTools?: IDiscoveredTool[];
  environment?: { [key: string]: string };
  details?: { [key: string]: any };
  shell?: boolean;
  contributed?: string|string[];
  final?: boolean;
}

export interface GameStored {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  extensionPath: string;
  imageURL: string;
  requiredFiles: string[];
  executable: string;
  parameters: string[];
  supportedTools: IDiscoveredTool[];
  environment: { [key: string]: string };
  details: { [key: string]: any };
  shell: boolean;
  contributed: string|string[];
  final: boolean;
}
