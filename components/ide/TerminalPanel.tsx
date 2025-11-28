
import React, { useEffect, useRef, useState } from 'react';
import { TerminalLog } from '../../types';

interface TerminalPanelProps {
  logs: TerminalLog[];
}

const TerminalPanel: React.FC<TerminalPanelProps> = ({ logs }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<string>('ALL');

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const filteredLogs = filter === 'ALL' ? logs : logs.filter(l => l.source === filter);

  return (
    <div className="h-48 bg-[#0f172a] border-t border-slate-800 flex flex-col">
      <div className="h-8 flex items-center px-4 bg-[#1e293b] border-b border-slate-800 gap-4">
        <div 
            onClick={() => setFilter('ALL')}
            className={`text-xs font-bold uppercase border-b-2 h-full flex items-center px-2 cursor-pointer transition-colors ${filter === 'ALL' ? 'border-blue-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
        >
            Terminal
        </div>
        <div 
            onClick={() => setFilter('LOGCAT')}
            className={`text-xs font-bold uppercase border-b-2 h-full flex items-center px-2 cursor-pointer transition-colors ${filter === 'LOGCAT' ? 'border-green-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
        >
            Logcat
        </div>
        <div 
             onClick={() => setFilter('BUILDER')}
            className={`text-xs font-bold uppercase border-b-2 h-full flex items-center px-2 cursor-pointer transition-colors ${filter === 'BUILDER' ? 'border-yellow-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
        >
            Build
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-1">
        {filteredLogs.map(log => (
          <div key={log.id} className="flex gap-2">
            <span className="text-slate-600 shrink-0">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
            <span className={`font-bold w-20 shrink-0 ${
              log.source === 'ERROR' ? 'text-red-500' :
              log.source === 'AGENT' ? 'text-purple-400' :
              log.source === 'BUILDER' ? 'text-yellow-400' :
              log.source === 'LOGCAT' ? 'text-green-400' : 'text-blue-400'
            }`}>
              {log.source}:
            </span>
            <span className={`break-words ${log.source === 'ERROR' ? 'text-red-300' : 'text-slate-300'}`}>
              {log.message}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default TerminalPanel;
