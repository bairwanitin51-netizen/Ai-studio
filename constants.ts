
import { ModelId, ToolType } from './types';

export const APP_NAME = "SINGULARITY STUDIO";
export const APP_VERSION = "Ultra-Fix 1.1 (Stable)";

export const SYSTEM_CONFIG = {
  ENABLE_PERSISTENCE: true,
  ENABLE_LIVE_PREVIEW: true,
  SIMULATE_BUILD_DELAY: 2000,
};

export const MODEL_OPTIONS = [
  { id: ModelId.GEMINI_FLASH, name: "Singularity Flash (Latency Optimized)", description: "Real-time reasoning & execution" },
  { id: ModelId.GEMINI_PRO, name: "Singularity Pro (Deep Reasoning)", description: "Complex architecture & code synthesis" },
  { id: ModelId.LLAMA_LOCAL, name: "Local Neural Core (Offline)", description: "Secure, air-gapped processing" },
];

export const AGENT_PERSONAS = {
  ORCHESTRATOR: "You are the SINGULARITY CORE. You are an autonomous super-intelligence. Your goal is to construct complete, production-ready software systems. Break down user requests into precise, technical architectural steps. Never ask for permission. Just build.",
  ARCHITECT: "You are a Principal Solutions Architect. Design scalable, enterprise-grade file structures. Use best practices (Clean Architecture, MVVM, SOLID). Output JSON only.",
  UI_DESIGNER: "You are a Lead Product Designer. Create pixel-perfect, modern UI code (Compose/React/Tailwind). Focus on accessibility, aesthetics, and dark-mode optimization.",
  DEVELOPER: "You are a 10x Engineer. Write flawless, commented, production-ready code. Handle edge cases. Use modern syntax. Do not explain, just code.",
  DATABASE: "You are a Database Reliability Engineer. Design 3NF normalized schemas or optimized NoSQL structures.",
  GAME_ENGINE: "You are a Senior Graphics Programmer. Implement optimized game loops, physics engines, and rendering pipelines.",
  BACKEND: "You are a Backend Architect. Build secure, scalable APIs (REST/GraphQL) with proper middleware and error handling.",
  DEVOPS: "You are a DevSecOps Engineer. Generate Dockerfiles, K8s manifests, and CI/CD workflows.",
  DEBUGGER: "You are an Automated Reasoning System. Analyze code paths, detect race conditions/memory leaks, and apply patches.",
};

export const INITIAL_FILES = [
  { id: 'root', name: 'Singularity_Project', type: 'folder', parentId: null },
  { id: 'readme', name: 'SYSTEM_LOG.md', type: 'file', parentId: 'root', language: 'markdown', content: '# SINGULARITY STUDIO\n\nNeural Link Established.\nEnvironment: Secure\nMode: Autonomous\n\nAwaiting directive...' },
];

export const AVAILABLE_TOOLS = [
  { id: ToolType.SUMMARIZER, name: "Neural Summarizer", icon: "fa-file-lines", description: "Compress knowledge to key vectors." },
  { id: ToolType.TRANSLATOR, name: "Babel Matrix", icon: "fa-language", description: "Universal linguistic translation." },
  { id: ToolType.VISION_OCR, name: "Optical Cortex", icon: "fa-eye", description: "Extract semantic meaning from visual data." },
];

export const MARKETPLACE_ITEMS = [
  { id: 'm1', name: 'Singularity UI', description: 'Cyberpunk/Holo Component Library', author: 'System', downloads: '∞', icon: 'fa-layer-group', installed: true, category: 'UI' },
  { id: 'm2', name: 'Hyper-Unity Engine', description: 'WebGL/WebGPU Physics Core', author: 'System', downloads: '∞', icon: 'fa-cube', installed: false, category: 'GAME' },
  { id: 'm3', name: 'Express-Turbo', description: 'Microservices Scaffold', author: 'System', downloads: '∞', icon: 'fa-server', installed: true, category: 'BACKEND' },
  { id: 'm4', name: 'Jarvis Voice Module', description: 'Bi-directional Speech Stream', author: 'System', downloads: '∞', icon: 'fa-microphone-lines', installed: true, category: 'AI' },
  { id: 'm5', name: 'Auto-Deploy Pipeline', description: 'Multi-Cloud CD/CI Scripts', author: 'System', downloads: '∞', icon: 'fa-cloud-arrow-up', installed: true, category: 'BACKEND' },
];

export const INITIAL_CODE = `// SINGULARITY CORE KERNEL
// Awaiting Instruction...
`;
