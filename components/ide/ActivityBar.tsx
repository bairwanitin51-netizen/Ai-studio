
import React from 'react';
import { ActivityView } from '../../types';

interface ActivityBarProps {
  activeView: ActivityView;
  onViewChange: (view: ActivityView) => void;
}

const ActivityBar: React.FC<ActivityBarProps> = ({ activeView, onViewChange }) => {
  const items = [
    { view: ActivityView.EXPLORER, icon: 'fa-copy', label: 'Explorer' },
    { view: ActivityView.SEARCH, icon: 'fa-search', label: 'Search' },
    { view: ActivityView.AGENTS, icon: 'fa-robot', label: 'AI Agents' },
    { view: ActivityView.MARKETPLACE, icon: 'fa-puzzle-piece', label: 'Extensions' },
    { view: ActivityView.GIT, icon: 'fa-code-branch', label: 'Source Control' },
  ];

  return (
    <div className="w-12 bg-slate-900 flex flex-col items-center py-2 border-r border-slate-800 z-20">
      {items.map((item) => (
        <button
          key={item.view}
          onClick={() => onViewChange(item.view)}
          className={`w-10 h-10 mb-2 rounded flex items-center justify-center transition-colors relative group ${
            activeView === item.view 
              ? 'text-white' 
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          {activeView === item.view && (
             <div className="absolute left-0 top-2 bottom-2 w-1 bg-blue-500 rounded-r"></div>
          )}
          <i className={`fa-solid ${item.icon} text-lg`}></i>
          {/* Tooltip */}
          <div className="absolute left-10 bg-slate-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none border border-slate-700">
            {item.label}
          </div>
        </button>
      ))}
      <div className="flex-1"></div>
      <button
         onClick={() => onViewChange(ActivityView.SETTINGS)}
         className={`w-10 h-10 mb-2 rounded flex items-center justify-center transition-colors ${activeView === ActivityView.SETTINGS ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
      >
        <i className="fa-solid fa-gear text-lg"></i>
      </button>
    </div>
  );
};

export default ActivityBar;
