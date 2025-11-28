import React from 'react';
import { ViewMode } from '../types';
import { APP_NAME } from '../constants';

interface NavigationProps {
  currentMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentMode, onModeChange }) => {
  const navItems = [
    { mode: ViewMode.CHAT, icon: 'fa-comments', label: 'AI Chat' },
    { mode: ViewMode.EDITOR, icon: 'fa-code', label: 'Code Editor' },
    { mode: ViewMode.TOOLS, icon: 'fa-toolbox', label: 'AI Tools' },
    // { mode: ViewMode.SETTINGS, icon: 'fa-cog', label: 'Settings' },
  ];

  return (
    <nav className="bg-slate-900 border-r border-slate-800 w-16 md:w-64 flex-shrink-0 flex flex-col justify-between h-full transition-all duration-300">
      <div>
        <div className="h-16 flex items-center justify-center md:justify-start md:px-6 border-b border-slate-800">
          <i className="fa-solid fa-brain text-blue-500 text-2xl"></i>
          <span className="ml-3 font-bold text-lg hidden md:block text-slate-100 tracking-tight">{APP_NAME}</span>
        </div>
        
        <div className="flex flex-col gap-2 p-2 mt-4">
          {navItems.map((item) => (
            <button
              key={item.mode}
              onClick={() => onModeChange(item.mode)}
              className={`flex items-center p-3 rounded-lg transition-colors duration-200 group ${
                currentMode === item.mode
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              }`}
            >
              <i className={`fa-solid ${item.icon} text-xl w-8 text-center`}></i>
              <span className="ml-2 font-medium hidden md:block">{item.label}</span>
              
              {/* Tooltip for mobile */}
              <div className="md:hidden absolute left-14 bg-slate-800 text-slate-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none whitespace-nowrap">
                {item.label}
              </div>
            </button>
          ))}
        </div>
      </div>
      
      <div className="p-4 border-t border-slate-800">
         <div className="flex items-center text-slate-500 text-xs justify-center md:justify-start">
             <span className="hidden md:inline">v1.0.0 Online</span>
             <span className="md:hidden">v1</span>
         </div>
      </div>
    </nav>
  );
};

export default Navigation;
