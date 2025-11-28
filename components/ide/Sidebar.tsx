
import React from 'react';
import { ActivityView, AgentTask, MarketplaceItem, VirtualFile } from '../../types';
import { MARKETPLACE_ITEMS } from '../../constants';
import AgentPanel from './AgentPanel';

interface SidebarProps {
  activeView: ActivityView;
  files: VirtualFile[];
  activeFileId: string | null;
  agentTasks: AgentTask[];
  onFileSelect: (id: string) => void;
  onInstallPlugin: (id: string) => void;
  onRunAgent?: (goal: string) => void;
  isBusy?: boolean;
  onBuild?: () => void;
}

const FileIcon: React.FC<{ name: string; type: string }> = ({ name, type }) => {
  if (type === 'folder') return <i className="fa-solid fa-folder text-blue-400 mr-2"></i>;
  if (name.endsWith('.kt')) return <i className="fa-brands fa-android text-green-500 mr-2"></i>;
  if (name.endsWith('.xml')) return <i className="fa-solid fa-code text-orange-500 mr-2"></i>;
  if (name.endsWith('.json')) return <i className="fa-solid fa-file-code text-yellow-500 mr-2"></i>;
  if (name.endsWith('.md')) return <i className="fa-solid fa-info-circle text-blue-300 mr-2"></i>;
  if (name.endsWith('.js') || name.endsWith('.ts') || name.endsWith('.tsx')) return <i className="fa-brands fa-js text-yellow-400 mr-2"></i>;
  return <i className="fa-solid fa-file text-slate-400 mr-2"></i>;
};

const FileTreeItem: React.FC<{
  file: VirtualFile;
  allFiles: VirtualFile[];
  depth: number;
  activeFileId: string | null;
  onSelect: (id: string) => void;
}> = ({ file, allFiles, depth, activeFileId, onSelect }) => {
  const children = allFiles.filter(f => f.parentId === file.id);
  const isOpen = true; 

  return (
    <div>
      <div 
        className={`flex items-center py-1 px-2 cursor-pointer hover:bg-slate-800 transition-colors ${activeFileId === file.id ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={() => onSelect(file.id)}
      >
        <span className="opacity-70 text-xs w-4">
            {file.type === 'folder' && <i className={`fa-solid fa-chevron-${isOpen ? 'down' : 'right'}`}></i>}
        </span>
        <FileIcon name={file.name} type={file.type} />
        <span className="text-sm truncate select-none">{file.name}</span>
      </div>
      {isOpen && children.map(child => (
        <FileTreeItem 
            key={child.id} 
            file={child} 
            allFiles={allFiles} 
            depth={depth + 1} 
            activeFileId={activeFileId}
            onSelect={onSelect}
        />
      ))}
    </div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ activeView, files, activeFileId, agentTasks, onFileSelect, onInstallPlugin, onRunAgent, isBusy, onBuild }) => {
  const rootFiles = files.filter(f => f.parentId === 'root');

  return (
    <div className="w-64 bg-[#0f172a] border-r border-slate-800 flex flex-col h-full shrink-0">
      {/* EXPLORER VIEW */}
      {activeView === ActivityView.EXPLORER && (
        <>
          <div className="h-10 flex items-center px-4 border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider justify-between">
            <span>Project Explorer</span>
            <i className="fa-solid fa-ellipsis hover:text-white cursor-pointer"></i>
          </div>
          <div className="flex-1 overflow-y-auto py-2">
            {rootFiles.map(file => (
              <FileTreeItem 
                key={file.id} 
                file={file} 
                allFiles={files} 
                depth={0} 
                activeFileId={activeFileId}
                onSelect={onFileSelect}
              />
            ))}
          </div>
        </>
      )}

      {/* MARKETPLACE VIEW */}
      {activeView === ActivityView.MARKETPLACE && (
        <>
           <div className="h-10 flex items-center px-4 border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
            Extensions
          </div>
          <div className="p-2 border-b border-slate-800">
             <input type="text" placeholder="Search extensions..." className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:border-blue-500 outline-none"/>
          </div>
          <div className="flex-1 overflow-y-auto">
             {MARKETPLACE_ITEMS.map(item => (
                <div key={item.id} className="p-3 border-b border-slate-800 hover:bg-slate-800 group">
                   <div className="flex gap-3">
                      <div className="w-8 h-8 bg-slate-700 rounded flex items-center justify-center text-blue-400">
                         <i className={`fa-solid ${item.icon}`}></i>
                      </div>
                      <div className="flex-1 min-w-0">
                         <div className="font-bold text-sm text-slate-200 truncate">{item.name}</div>
                         <div className="text-xs text-slate-500 truncate">{item.description}</div>
                         <div className="flex items-center justify-between mt-2">
                            <span className="text-[10px] text-slate-600">{item.author} • {item.downloads}</span>
                            <button 
                               onClick={() => onInstallPlugin(item.id)}
                               className={`text-[10px] px-2 py-0.5 rounded border ${item.installed ? 'bg-slate-700 text-slate-400 border-slate-600' : 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'}`}
                            >
                               {item.installed ? 'Installed' : 'Install'}
                            </button>
                         </div>
                      </div>
                   </div>
                </div>
             ))}
          </div>
        </>
      )}

      {/* AGENTS VIEW */}
      {activeView === ActivityView.AGENTS && (
          <div className="flex flex-col h-full">
            <div className="h-10 flex items-center px-4 border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
                Omega Intelligence
            </div>
            
            {/* Control Panel (Now integrated into sidebar for better flow) */}
            {onRunAgent && <AgentPanel isBusy={!!isBusy} onRunAgent={onRunAgent} onBuild={onBuild || (() => {})} />}

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0f172a]">
                <div className="text-xs font-bold text-slate-500 mb-2 uppercase">Task Queue</div>
                {agentTasks.length === 0 && (
                    <div className="text-xs text-slate-600 text-center italic mt-4">Awaiting neural input...</div>
                )}
                {agentTasks.map(task => (
                    <div key={task.id} className="bg-slate-800/50 rounded p-2 border border-slate-700">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-bold text-purple-300">{task.role}</span>
                            <span className={`text-[9px] px-1 rounded uppercase ${task.status === 'running' ? 'bg-blue-900 text-blue-200 animate-pulse' : task.status === 'completed' ? 'bg-green-900 text-green-200' : 'bg-slate-700 text-slate-400'}`}>
                                {task.status}
                            </span>
                        </div>
                        <p className="text-[10px] text-slate-300 leading-tight">{task.description}</p>
                    </div>
                ))}
            </div>
          </div>
      )}
    </div>
  );
};

export default Sidebar;
