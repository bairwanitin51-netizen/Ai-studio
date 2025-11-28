
import React, { useState } from 'react';
import IdeWorkspace from './features/IdeWorkspace';
import OmegaDashboard from './features/OmegaDashboard';
import { ProjectTemplateType } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'DASHBOARD' | 'IDE'>('DASHBOARD');
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplateType | undefined>(undefined);

  const handleOpenProject = (template: ProjectTemplateType) => {
    setSelectedTemplate(template);
    setCurrentView('IDE');
  };

  const handleExitIde = () => {
    setCurrentView('DASHBOARD');
    setSelectedTemplate(undefined);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30">
      {currentView === 'DASHBOARD' ? (
        <OmegaDashboard onOpenProject={handleOpenProject} />
      ) : (
        <IdeWorkspace 
          initialTemplate={selectedTemplate} 
          onExit={handleExitIde} 
        />
      )}
    </div>
  );
};

export default App;
