
import React, { useState } from 'react';

interface AgentPanelProps {
  isBusy: boolean;
  onRunAgent: (goal: string) => void;
  onBuild: () => void;
}

const AgentPanel: React.FC<AgentPanelProps> = ({ isBusy, onRunAgent, onBuild }) => {
  const [goal, setGoal] = useState('');
  const [voiceMode, setVoiceMode] = useState(false);

  return (
    <div className="bg-[#1e293b] border-b border-slate-800 p-3">
      <div className="flex items-center justify-between mb-2">
         <span className="text-[10px] font-bold text-slate-400 uppercase">Input Stream</span>
         <button 
           onClick={() => setVoiceMode(!voiceMode)}
           className={`text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 transition-colors ${voiceMode ? 'bg-red-900/50 text-red-400 border border-red-800 animate-pulse' : 'bg-slate-800 text-slate-500 border border-slate-700'}`}
         >
            <i className={`fa-solid ${voiceMode ? 'fa-microphone-lines' : 'fa-microphone-slash'}`}></i>
            {voiceMode ? 'JARVIS ON' : 'VOICE OFF'}
         </button>
      </div>
      
      <div className="bg-slate-900 rounded-lg p-1 border border-slate-700 mb-2 focus-within:ring-1 focus-within:ring-purple-500/50 transition-all">
            <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder={voiceMode ? "Listening..." : "Describe app goal (e.g. 'Build a Flappy Bird clone')..."}
            className="w-full h-16 bg-transparent text-xs text-slate-300 focus:outline-none resize-none p-2 placeholder:text-slate-600"
            disabled={voiceMode} // Simulate voice input taking over
            />
            <div className="flex justify-between items-center px-2 pb-1 bg-slate-900/50">
                <div className="text-[9px] text-slate-500 flex items-center gap-1">
                    <i className="fa-solid fa-bolt text-yellow-500"></i>
                    Gemini Pro
                </div>
                <button
                    onClick={() => onRunAgent(goal)}
                    disabled={isBusy || (!goal.trim() && !voiceMode)}
                    className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:bg-slate-700 text-white px-3 py-1 rounded text-[10px] font-bold transition-colors flex items-center gap-1 shadow-lg shadow-purple-900/20"
                >
                    {isBusy ? <i className="fa-solid fa-circle-notch animate-spin"></i> : <i className="fa-solid fa-paper-plane"></i>}
                    EXECUTE
                </button>
            </div>
      </div>
    </div>
  );
};

export default AgentPanel;
