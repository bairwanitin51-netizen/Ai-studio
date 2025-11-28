
export enum ViewMode {
  OS = 'OS',
  IDE = 'IDE',
  PREVIEW = 'PREVIEW',
  CHAT = 'CHAT',
  EDITOR = 'EDITOR',
  TOOLS = 'TOOLS',
}

export enum ModelId {
  GEMINI_FLASH = 'gemini-2.5-flash',
  GEMINI_PRO = 'gemini-3-pro-preview',
  GEMINI_FLASH_LITE = 'gemini-flash-lite-latest',
  LLAMA_LOCAL = 'llama-3-local-gguf',
  OFFLINE_NANO = 'gemini-nano-offline',
}

export type FileType = 'file' | 'folder';

export interface VirtualFile {
  id: string;
  name: string;
  type: FileType;
  content?: string;
  parentId: string | null;
  isOpen?: boolean;
  language?: string;
}

export interface ProjectMetadata {
  id: string;
  name: string;
  type: ProjectTemplateType;
  lastModified: number;
  version: string;
}

export interface ProjectState extends ProjectMetadata {
  files: VirtualFile[];
  activeFileId: string | null;
  openFiles: string[];
  terminalLogs: TerminalLog[];
  buildStatus: 'idle' | 'building' | 'success' | 'failed';
  deployStatus: 'idle' | 'deploying' | 'live' | 'failed';
}

export interface TerminalLog {
  id: string;
  timestamp: number;
  source: 'SYSTEM' | 'OMEGA' | 'AGENT' | 'BUILDER' | 'ERROR' | 'LOGCAT' | 'DEPLOY';
  message: string;
}

export enum AgentRole {
  ORCHESTRATOR = 'ORCHESTRATOR', // The Brain
  ARCHITECT = 'ARCHITECT',
  UI_DESIGNER = 'UI_DESIGNER',
  DEVELOPER = 'DEVELOPER',
  DEBUGGER = 'DEBUGGER',
  BUILDER = 'BUILDER', // APK/Webpack builder
  DATABASE = 'DATABASE',
  GAME_ENGINE = 'GAME_ENGINE',
  BACKEND = 'BACKEND',
  DEVOPS = 'DEVOPS',
  DEPLOYER = 'DEPLOYER'
}

export interface AgentTask {
  id: string;
  role: AgentRole;
  description: string;
  status: 'pending' | 'planning' | 'running' | 'completed' | 'failed';
  logs: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  isError?: boolean;
}

export enum ToolType {
  SUMMARIZER = 'SUMMARIZER',
  TRANSLATOR = 'TRANSLATOR',
  VISION_OCR = 'VISION_OCR',
}

export enum ActivityView {
  EXPLORER = 'EXPLORER',
  SEARCH = 'SEARCH',
  AGENTS = 'AGENTS',
  MARKETPLACE = 'MARKETPLACE',
  GIT = 'GIT',
  SETTINGS = 'SETTINGS'
}

export interface MarketplaceItem {
  id: string;
  name: string;
  description: string;
  author: string;
  downloads: string;
  icon: string;
  installed: boolean;
  category: 'UI' | 'BACKEND' | 'GAME' | 'AI';
}

export enum ProjectTemplateType {
  ANDROID_EMPTY = 'ANDROID_EMPTY',
  ANDROID_COMPOSE = 'ANDROID_COMPOSE',
  WEB_REACT = 'WEB_REACT',
  GAME_CANVAS = 'GAME_CANVAS',
  BACKEND_NODE = 'BACKEND_NODE',
  AI_AGENT = 'AI_AGENT'
}

export enum DeploymentTarget {
  FIREBASE = 'Firebase Hosting',
  VERCEL = 'Vercel',
  GCP_RUN = 'Google Cloud Run',
  PLAY_STORE = 'Google Play Console'
}
