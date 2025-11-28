
import React, { useEffect, useState } from 'react';
import { ProjectMetadata, ProjectTemplateType } from '../types';
import { APP_NAME, APP_VERSION } from '../constants';
import { loadRecentProjects } from '../services/persistenceService';

interface OmegaDashboardProps {
  onOpenProject: (type: ProjectTemplateType) => void;
}

const OmegaDashboard: React.FC<OmegaDashboardProps> = ({ onOpenProject }) => {
  const [recents, setRecents] = useState<ProjectMetadata[]>([]);

  useEffect(() => {
    setRecents(loadRecentProjects());
  }, []);

  const cards = [
    { type: ProjectTemplateType.ANDROID_COMPOSE, title: "Android System", icon: "fa-android", color: "text-emerald-400", bg: "bg-emerald-900/10 border-emerald-900/50", desc: "Native Compilation Target" },
    { type: ProjectTemplateType.WEB_REACT, title: "Web Neural Net", icon: "fa-react", color: "text-cyan-400", bg: "bg-cyan-900/10 border-cyan-900/50", desc: "Distributed Interface" },
    { type: ProjectTemplateType.GAME_CANVAS, title: "Physics Engine", icon: "fa-cube", color: "text-fuchsia-400", bg: "bg-fuchsia-900/10 border-fuchsia-900/50", desc: "WebGL/GPU Simulation" },
    { type: ProjectTemplateType.BACKEND_NODE, title: "Server Core", icon: "fa-server", color: "text-orange-400", bg: "bg-orange-900/10 border-orange-900/50", desc: "Scalable API Mesh" },
    { type: ProjectTemplateType.AI_AGENT, title: "Autonomous Agent", icon: "fa-brain", color: "text-indigo-400", bg: "bg-indigo-900/10 border-indigo-900/50", desc: "Self-Learning Entity" },
  ];

  return (
    <div className="flex flex-col h-full w-full bg-[#03060a] text-white relative overflow-hidden font-mono selection:bg-cyan-500/30">
      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(17,24,39,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(17,24,39,0.5)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none"></div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-10 py-8 border-b border-slate-900/50">
        <div className="flex flex-col">
           <h1 className="text-4xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
             {APP_NAME}
           </h1>
           <div className="flex items-center gap-2 mt-2">
             <span className="px-2 py-0.5 bg-cyan-950 border border-cyan-800 rounded text-[10px] text-cyan-400 font-bold tracking-widest uppercase">
               {APP_VERSION}
             </span>
             <span className="text-slate-600 text-xs">/// SECURE CONNECTION</span>
           </div>
        </div>
        <div className="flex items-center gap-6">
           <div className="text-right hidden md:block">
              <div className="text-[10px] text-slate-500 uppercase tracking-widest">System Integrity</div>
              <div className="text-cyan-400 text-sm font-bold flex items-center gap-2 justify-end drop-shadow-lg">
                 <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-[pulse_2s_infinite]"></div>
                 100% OPERATIONAL
              </div>
           </div>
           <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:border-cyan-500 transition-colors cursor-pointer group">
              <i className="fa-solid fa-fingerprint text-xl text-slate-400 group-hover:text-cyan-400 transition-colors"></i>
           </div>
        </div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-10 overflow-y-auto">
         
         {/* Recent Projects (Memory Bank) */}
         {recents.length > 0 && (
             <div className="w-full max-w-[1400px] mb-8">
                <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <i className="fa-solid fa-clock-rotate-left"></i> Memory Bank (Recent)
                </h2>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
                    {recents.map(proj => (
                        <div key={proj.id} className="min-w-[200px] bg-slate-900/50 border border-slate-800 p-4 rounded hover:border-cyan-500 cursor-pointer transition-colors group">
                            <div className="text-sm font-bold text-slate-200 group-hover:text-cyan-400 truncate">{proj.name}</div>
                            <div className="text-[10px] text-slate-500 mt-1">{new Date(proj.lastModified).toLocaleDateString()}</div>
                            <div className="text-[9px] text-slate-600 uppercase mt-2">{proj.type.replace('PROJECT_','')}</div>
                        </div>
                    ))}
                </div>
             </div>
         )}

         <h2 className="text-lg font-bold mb-8 text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
            <span className="w-8 h-[1px] bg-slate-700"></span>
            Initialize Protocol
            <span className="w-8 h-[1px] bg-slate-700"></span>
         </h2>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-[1400px] w-full">
            {cards.map((card) => (
               <button 
                  key={card.type}
                  onClick={() => onOpenProject(card.type)}
                  className={`relative overflow-hidden ${card.bg} border p-6 rounded-none clip-path-polygon hover:border-opacity-100 transition-all group flex flex-col items-center text-center backdrop-blur-sm`}
                  style={{ clipPath: "polygon(10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%, 0 10%)" }}
               >
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-white`}></div>
                  <div className={`w-16 h-16 rounded-lg bg-[#050911] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-slate-800 shadow-xl z-10`}>
                     <i className={`fa-brands ${card.icon} text-3xl ${card.color} drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]`}></i>
                  </div>
                  <h3 className="text-base font-bold mb-2 text-slate-200 group-hover:text-white tracking-wide">{card.title}</h3>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest">{card.desc}</p>
                  
                  {/* Tech decoration */}
                  <div className="absolute top-2 right-2 flex gap-1">
                    <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
                    <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
                  </div>
               </button>
            ))}
         </div>

         {/* Bottom Status Bar */}
         <div className="mt-20 w-full max-w-5xl bg-[#0a0f1a] rounded-sm border-t border-slate-800 flex items-center justify-between px-6 py-2 text-[10px] font-mono uppercase tracking-wider text-slate-500">
            <div className="flex items-center gap-6">
               <span className="flex items-center gap-2">
                 <i className="fa-solid fa-microchip text-slate-600"></i>
                 <span>Core: 12 TH/s</span>
               </span>
               <span className="flex items-center gap-2">
                 <i className="fa-solid fa-memory text-slate-600"></i>
                 <span>Mem: 256 PB</span>
               </span>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
               <span>Singularity Agent: Standing By</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default OmegaDashboard;
