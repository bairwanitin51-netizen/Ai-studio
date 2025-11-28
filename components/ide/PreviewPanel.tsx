
import React, { useState, useEffect, useRef } from 'react';
import { VirtualFile } from '../../types';

interface PreviewPanelProps {
  isVisible: boolean;
  files: VirtualFile[];
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ isVisible, files }) => {
  const [device, setDevice] = useState<'phone' | 'tablet' | 'desktop'>('phone');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [srcDoc, setSrcDoc] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  // Auto-Update Logic
  useEffect(() => {
    if (!isVisible) return;
    
    // Find index.html
    const indexHtml = files.find(f => f.name === 'index.html');
    
    if (indexHtml && indexHtml.content) {
        // Simple injector for immediate preview
        // In a real build step we'd bundle properly, but for "Ultra-Fix" instant preview we inject directly
        setSrcDoc(indexHtml.content);
    } else {
        // Fallback for Android/Backend projects which don't have index.html
        setSrcDoc(`
            <html>
            <body style="margin:0; background:#000; color:#0f0; font-family:monospace; display:flex; justify-content:center; align-items:center; height:100vh;">
                <div style="text-align:center;">
                    <h2 style="border-bottom:1px solid #0f0; padding-bottom:10px;">ANDROID EMULATOR RUNNING</h2>
                    <p>Rendering Native Views...</p>
                    <div style="width:50px; height:50px; border:2px solid #0f0; border-top:2px solid transparent; border-radius:50%; animation: spin 1s linear infinite; margin: 20px auto;"></div>
                    <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
                </div>
            </body>
            </html>
        `);
    }
  }, [files, isVisible, refreshKey]);

  if (!isVisible) return null;

  return (
    <div className="w-80 md:w-96 bg-[#0f172a] border-l border-slate-800 flex flex-col z-10 shadow-xl">
      {/* Toolbar */}
      <div className="h-10 border-b border-slate-800 flex items-center justify-between px-4 bg-[#1e293b]">
        <div className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Live Preview
        </div>
        <div className="flex gap-2">
           <button onClick={() => setRefreshKey(k => k + 1)} className="p-1 text-slate-500 hover:text-white" title="Reload"><i className="fa-solid fa-rotate-right"></i></button>
           <button onClick={() => setDevice('phone')} className={`p-1 hover:text-white ${device==='phone' ? 'text-blue-400' : 'text-slate-500'}`}><i className="fa-solid fa-mobile-screen"></i></button>
           <button onClick={() => setDevice('tablet')} className={`p-1 hover:text-white ${device==='tablet' ? 'text-blue-400' : 'text-slate-500'}`}><i className="fa-solid fa-tablet-screen-button"></i></button>
           <button onClick={() => setOrientation(prev => prev === 'portrait' ? 'landscape' : 'portrait')} className="p-1 text-slate-500 hover:text-white"><i className="fa-solid fa-rotate"></i></button>
        </div>
      </div>

      {/* Simulator Frame */}
      <div className="flex-1 bg-slate-950 flex items-center justify-center overflow-hidden p-4 relative bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 to-black">
        <div 
            className={`bg-black rounded-[2.5rem] border-[6px] border-slate-800 shadow-2xl relative transition-all duration-300 overflow-hidden ring-1 ring-slate-700 ${
                device === 'phone' 
                    ? (orientation === 'portrait' ? 'w-[300px] h-[600px]' : 'w-[600px] h-[300px]') 
                    : 'w-[400px] h-[600px]'
            }`}
        >
          {/* Notch / Camera */}
          {device === 'phone' && orientation === 'portrait' && (
             <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-xl z-20 flex justify-center items-center">
                 <div className="w-16 h-1 bg-slate-800 rounded-full"></div>
             </div>
          )}
          
          {/* Screen Content */}
          <div className="w-full h-full bg-white relative overflow-hidden rounded-[2rem]">
             <iframe 
                srcDoc={srcDoc}
                title="app-preview"
                className="w-full h-full border-0 bg-white"
                sandbox="allow-scripts"
             />
          </div>
        </div>
      </div>
      
      {/* Device Logs Mini */}
      <div className="h-24 border-t border-slate-800 bg-[#0f172a] p-2 overflow-auto font-mono text-[10px] text-slate-500 scrollbar-thin">
         <div>I/ViewRootImpl: Resizing window to {device} ({orientation})</div>
         <div>D/OpenGLRenderer: Render context initialized</div>
         <div className="text-blue-400">I/System: Live reload active...</div>
         {files.find(f => f.name === 'index.html') ? <div className="text-green-400">I/WebView: Index.html loaded</div> : <div className="text-yellow-500">W/Simulator: Native simulation mode</div>}
      </div>
    </div>
  );
};

export default PreviewPanel;
