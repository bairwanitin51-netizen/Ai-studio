
import React, { useState, useEffect } from 'react';
import ActivityBar from '../components/ide/ActivityBar';
import Sidebar from '../components/ide/Sidebar';
import EditorArea from '../components/ide/EditorArea';
import TerminalPanel from '../components/ide/TerminalPanel';
import PreviewPanel from '../components/ide/PreviewPanel';
import { ProjectState, TerminalLog, VirtualFile, ActivityView, AgentTask, ProjectTemplateType, DeploymentTarget } from '../types';
import { INITIAL_FILES } from '../constants';
import { orchestrateGoal, executeAgentTask } from '../services/omegaEngine';
import { updateFileContent } from '../services/virtualFileSystem';
import { generateAndroidTemplate, generateWebTemplate, generateGameTemplate, generateBackendTemplate, generateAgentTemplate } from '../services/projectTemplates';
import { buildProject, deployToCloud } from '../services/deploymentService';
import { saveProject, loadLastActiveProject } from '../services/persistenceService';
import { downloadProjectAsJSON, downloadSimulatedAPK } from '../services/fileExportService';

interface IdeWorkspaceProps {
  initialTemplate?: ProjectTemplateType;
  onExit: () => void;
}

const IdeWorkspace: React.FC<IdeWorkspaceProps> = ({ initialTemplate, onExit }) => {
  const [activeView, setActiveView] = useState<ActivityView>(ActivityView.EXPLORER);
  const [project, setProject] = useState<ProjectState>({
    id: `p_${Date.now()}`,
    name: 'Untitled Project',
    type: initialTemplate || ProjectTemplateType.ANDROID_EMPTY,
    lastModified: Date.now(),
    version: '1.0',
    files: INITIAL_FILES as VirtualFile[],
    activeFileId: 'readme',
    openFiles: ['readme'],
    terminalLogs: [{ id: '1', timestamp: Date.now(), source: 'OMEGA', message: 'Singularity Core Initialized.' }],
    buildStatus: 'idle',
    deployStatus: 'idle'
  });
  
  const [agentTasks, setAgentTasks] = useState<AgentTask[]>([]);
  const [isOrchestrating, setIsOrchestrating] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  // Initialize Template or Load Previous
  useEffect(() => {
    // If we passed a template, we create new. If not, maybe we load recent? 
    // For now, if initialTemplate is set, we overwrite. 
    if (initialTemplate) {
      let files = [...project.files];
      let name = project.name;
      
      switch (initialTemplate) {
        case ProjectTemplateType.ANDROID_COMPOSE:
          files = generateAndroidTemplate(files);
          name = "Android_System";
          addLog('SYSTEM', 'Loaded Android Compose Template');
          break;
        case ProjectTemplateType.WEB_REACT:
          files = generateWebTemplate(files);
          name = "Web_Neural_Net";
          addLog('SYSTEM', 'Loaded Web Live Template');
          break;
        case ProjectTemplateType.GAME_CANVAS:
          files = generateGameTemplate(files);
          name = "Physics_Engine";
          addLog('SYSTEM', 'Loaded Game Engine Template');
          break;
        case ProjectTemplateType.BACKEND_NODE:
          files = generateBackendTemplate(files);
          name = "Server_Core";
          addLog('SYSTEM', 'Loaded Node.js API Template');
          break;
        case ProjectTemplateType.AI_AGENT:
          files = generateAgentTemplate(files);
          name = "Autonomous_Agent";
          addLog('SYSTEM', 'Loaded AI Agent Template');
          break;
        default:
          break;
      }
      setProject(prev => ({ ...prev, files, name, type: initialTemplate }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTemplate]);

  // Auto Save
  useEffect(() => {
    if (project.files.length > 2) {
        saveProject(project);
    }
  }, [project.files, project.activeFileId]);

  const addLog = (source: TerminalLog['source'], message: string) => {
    setProject(prev => ({
      ...prev,
      terminalLogs: [...prev.terminalLogs, { id: Date.now().toString(), timestamp: Date.now(), source, message }]
    }));
  };

  const handleRunAgent = async (goal: string) => {
    setIsOrchestrating(true);
    addLog('OMEGA', `User Directive: "${goal}"`);
    setActiveView(ActivityView.AGENTS); 

    try {
      addLog('OMEGA', 'Initializing Neural Plan...');
      const tasks = await orchestrateGoal(goal);
      setAgentTasks(tasks);
      addLog('OMEGA', `Plan Generated: ${tasks.length} Vectors.`);

      for (const task of tasks) {
        setAgentTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'running' } : t));
        addLog('AGENT', `[${task.role}] Executing vector: ${task.description}`);
        
        const activeContent = project.files.find(f => f.id === project.activeFileId)?.content || '';
        const context = `Files: ${project.files.map(f => f.name).join(', ')}\nActive File Content:\n${activeContent}`;
        
        const result = await executeAgentTask(task, context);
        
        if (result.code) {
             const targetFile = project.activeFileId;
             if (targetFile) {
                 setProject(prev => ({
                    ...prev,
                    files: updateFileContent(prev.files, targetFile, result.code!)
                 }));
                 addLog('SYSTEM', `Code injected into stream.`);
             }
        }
        
        addLog('AGENT', `[${task.role}] Vector resolved.`);
        setAgentTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'completed' } : t));
        await new Promise(r => setTimeout(r, 200));
      }
      addLog('OMEGA', 'Directive execution complete.');

    } catch (error) {
      addLog('ERROR', `Orchestration failure: ${error}`);
    } finally {
      setIsOrchestrating(false);
    }
  };

  const handleBuild = async () => {
     if (project.buildStatus === 'building') return;
     setProject(prev => ({ ...prev, buildStatus: 'building' }));
     await buildProject(addLog);
     setProject(prev => ({ ...prev, buildStatus: 'success' }));
     
     // Auto Download if Android
     if (project.type === ProjectTemplateType.ANDROID_COMPOSE || project.type === ProjectTemplateType.ANDROID_EMPTY) {
         addLog('SYSTEM', 'Initiating auto-download of signed APK...');
         downloadSimulatedAPK(project.name);
     }
  };

  const handleDeploy = async () => {
      if (project.deployStatus === 'deploying') return;
      setProject(prev => ({ ...prev, deployStatus: 'deploying' }));
      let target = DeploymentTarget.VERCEL;
      if (project.type.includes('ANDROID')) target = DeploymentTarget.FIREBASE;
      if (project.type.includes('BACKEND')) target = DeploymentTarget.GCP_RUN;
      
      await deployToCloud(target, addLog);
      setProject(prev => ({ ...prev, deployStatus: 'live' }));
  };

  const handleExportZip = () => {
      addLog('SYSTEM', 'Compressing project to .omega archive...');
      downloadProjectAsJSON(project);
      addLog('SYSTEM', 'Export complete.');
  };

  const handleFileSelect = (id: string) => {
    const file = project.files.find(f => f.id === id);
    if (file && file.type === 'file') {
      setProject(prev => ({
        ...prev,
        activeFileId: id,
        openFiles: prev.openFiles.includes(id) ? prev.openFiles : [...prev.openFiles, id]
      }));
    }
  };

  const handleUpdateContent = (id: string, content: string) => {
      setProject(prev => ({
          ...prev,
          files: updateFileContent(prev.files, id, content)
      }));
  };

  const handleCloseFile = (id: string) => {
      setProject(prev => ({
          ...prev,
          openFiles: prev.openFiles.filter(fid => fid !== id),
          activeFileId: prev.activeFileId === id ? (prev.openFiles.length > 1 ? prev.openFiles[0] : null) : prev.activeFileId
      }));
  };

  return (
    <div className="flex h-full w-full bg-[#050911] text-slate-200 overflow-hidden font-mono selection:bg-cyan-500/30">
      {/* 1. Activity Bar */}
      <div className="flex flex-col z-20 border-r border-slate-900 bg-[#020408]">
         <div onClick={onExit} className="w-12 h-12 flex items-center justify-center cursor-pointer hover:bg-slate-900 text-cyan-500 transition-colors border-b border-slate-900" title="System Dashboard">
            <i className="fa-solid fa-grid-2"></i>
         </div>
         <ActivityBar activeView={activeView} onViewChange={setActiveView} />
      </div>

      {/* 2. Sidebar */}
      <Sidebar 
        activeView={activeView}
        files={project.files} 
        activeFileId={project.activeFileId} 
        agentTasks={agentTasks}
        onFileSelect={handleFileSelect} 
        onInstallPlugin={(id) => addLog('SYSTEM', `Module ${id} integrated.`)}
        onRunAgent={handleRunAgent}
        isBusy={isOrchestrating}
        onBuild={handleBuild}
      />
      
      {/* 3. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0d1117] relative">
        
        {/* Top Bar */}
        <div className="h-10 bg-[#0d1117] border-b border-slate-900 flex items-center justify-between px-4">
            <div className="text-[10px] text-slate-500 font-mono flex items-center gap-2 uppercase tracking-wider">
                <i className="fa-solid fa-folder-tree text-cyan-600"></i>
                {project.name} {project.activeFileId ? `// ${project.files.find(f=>f.id===project.activeFileId)?.name}` : ''}
                {project.lastModified && <span className="text-slate-700 ml-2">SAVED</span>}
            </div>
            <div className="flex items-center gap-2">
                 <button onClick={handleExportZip} className="px-3 py-1 rounded-sm hover:bg-[#1e293b] text-[10px] text-slate-400 border border-transparent hover:border-slate-700 transition-colors" title="Export Project Source">
                    <i className="fa-solid fa-download mr-1"></i> ZIP
                 </button>
                 <button 
                    onClick={handleBuild}
                    disabled={project.buildStatus === 'building'}
                    className="flex items-center gap-2 px-3 py-1 rounded-sm bg-[#1e293b] hover:bg-[#334155] text-[10px] font-bold border border-slate-700 transition-colors uppercase tracking-wide"
                 >
                    <i className={`fa-solid fa-hammer ${project.buildStatus === 'building' ? 'animate-spin text-yellow-500' : 'text-green-500'}`}></i>
                    {project.buildStatus === 'building' ? 'Compiling...' : 'Build APK'}
                 </button>
                 <button 
                    onClick={handleDeploy}
                    disabled={project.deployStatus === 'deploying'}
                    className="flex items-center gap-2 px-3 py-1 rounded-sm bg-[#1e293b] hover:bg-[#334155] text-[10px] font-bold border border-slate-700 transition-colors uppercase tracking-wide"
                 >
                    <i className={`fa-solid fa-rocket ${project.deployStatus === 'deploying' ? 'animate-bounce text-cyan-500' : 'text-purple-500'}`}></i>
                    {project.deployStatus === 'deploying' ? 'Deploying...' : 'Deploy Cloud'}
                 </button>
                 <button 
                    onClick={() => setShowPreview(!showPreview)}
                    className={`ml-2 w-8 h-8 flex items-center justify-center rounded hover:bg-slate-800 ${showPreview ? 'text-cyan-400' : 'text-slate-600'}`}
                    title="Toggle Simulator"
                 >
                    <i className="fa-solid fa-mobile-screen"></i>
                 </button>
            </div>
        </div>

        {/* Editor & Terminal Split */}
        <div className="flex-1 flex flex-col overflow-hidden">
            <EditorArea 
                files={project.files}
                activeFileId={project.activeFileId}
                openFiles={project.openFiles}
                onUpdateContent={handleUpdateContent}
                onCloseFile={handleCloseFile}
                onSelectFile={handleFileSelect}
            />
            <TerminalPanel logs={project.terminalLogs} />
        </div>
      </div>

      {/* 4. Preview Panel */}
      {showPreview && <PreviewPanel isVisible={showPreview} files={project.files} />}
    </div>
  );
};

export default IdeWorkspace;
