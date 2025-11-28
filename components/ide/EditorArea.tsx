
import React from 'react';
import { VirtualFile } from '../../types';

interface EditorAreaProps {
  files: VirtualFile[];
  activeFileId: string | null;
  openFiles: string[];
  onUpdateContent: (id: string, content: string) => void;
  onCloseFile: (id: string) => void;
  onSelectFile: (id: string) => void;
}

const EditorArea: React.FC<EditorAreaProps> = ({ files, activeFileId, openFiles, onUpdateContent, onCloseFile, onSelectFile }) => {
  const activeFile = files.find(f => f.id === activeFileId);

  if (!activeFileId) {
    return (
      <div className="flex-1 bg-[#0d1117] flex items-center justify-center text-slate-500 flex-col gap-4">
        <i className="fa-brands fa-android text-6xl opacity-20"></i>
        <p>Select a file or ask the Agent to build an app.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#0d1117] overflow-hidden">
      {/* Tabs */}
      <div className="flex bg-[#0f172a] border-b border-slate-800 overflow-x-auto scrollbar-hide">
        {openFiles.map(fileId => {
          const file = files.find(f => f.id === fileId);
          if (!file) return null;
          return (
            <div 
              key={fileId}
              onClick={() => onSelectFile(fileId)}
              className={`flex items-center px-4 py-2 text-sm cursor-pointer border-r border-slate-800 min-w-[120px] max-w-[200px] group ${
                activeFileId === fileId 
                  ? 'bg-[#0d1117] text-blue-400 border-t-2 border-t-blue-500' 
                  : 'bg-[#0f172a] text-slate-500 hover:bg-slate-800'
              }`}
            >
              <span className="truncate flex-1 mr-2">{file.name}</span>
              <button 
                onClick={(e) => { e.stopPropagation(); onCloseFile(fileId); }}
                className="opacity-0 group-hover:opacity-100 hover:text-red-400"
              >
                <i className="fa-solid fa-times text-xs"></i>
              </button>
            </div>
          );
        })}
      </div>

      {/* Editor */}
      <div className="flex-1 relative">
        <textarea
          value={activeFile?.content || ''}
          onChange={(e) => activeFile && onUpdateContent(activeFile.id, e.target.value)}
          className="w-full h-full bg-[#0d1117] text-slate-300 font-mono text-sm p-6 focus:outline-none resize-none leading-relaxed"
          spellCheck={false}
        />
        <div className="absolute bottom-2 right-4 text-xs text-slate-600 bg-[#0d1117]/80 px-2 py-1 rounded">
          {activeFile?.language?.toUpperCase()} • UTF-8
        </div>
      </div>
    </div>
  );
};

export default EditorArea;
