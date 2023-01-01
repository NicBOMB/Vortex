import { IDiscoveredTool } from '../../../types/IDiscoveredTool'

export interface IGameStored {
  id: string;
  name: string;
  shortName?: string;
  logo?: string;
  extensionPath?: string;
  imageURL?: string;
  requiredFiles: string[];
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
