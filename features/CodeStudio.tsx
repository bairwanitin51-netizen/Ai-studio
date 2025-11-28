import React, { useState } from 'react';
import { ModelId } from '../types';
import { generateCode } from '../services/geminiService';
import ModelSelector from '../components/ModelSelector';
import { INITIAL_CODE } from '../constants';

interface CodeStudioProps {
  modelId: ModelId;
  setModelId: (id: ModelId) => void;
}

const CodeStudio: React.FC<CodeStudioProps> = ({ modelId, setModelId }) => {
  const [code, setCode] = useState(INITIAL_CODE);
  const [instruction, setInstruction] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState<string | null>(null);

  const handleRun = () => {
    // Basic JS execution sandbox (safe-ish for demo)
    setOutput(null);
    try {
      const logs: string[] = [];
      const originalConsoleLog = console.log;
      
      console.log = (...args) => {
        logs.push(args.join(' '));
      };

      // eslint-disable-next-line no-new-func
      const runCode = new Function(code);
      runCode();

      console.log = originalConsoleLog;
      setOutput(logs.length > 0 ? logs.join('\n') : "Code executed successfully (No output)");
    } catch (err: any) {
      setOutput(`Error: ${err.message}`);
    }
  };

  const handleAiEdit = async () => {
    if (!instruction.trim()) return;
    setIsGenerating(true);
    try {
      const newCode = await generateCode(modelId, instruction, code);
      setCode(newCode);
      setInstruction('');
    } catch (error) {
      alert("Failed to generate code. See console.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-200">
       {/* Toolbar */}
      <div className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <i className="fa-solid fa-code text-purple-500"></i>
            Code Studio
          </h2>
          <button 
            onClick={handleRun}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors"
          >
            <i className="fa-solid fa-play"></i> Run
          </button>
        </div>
        <ModelSelector selectedModel={modelId} onSelect={setModelId} disabled={isGenerating} />
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Editor Column */}
        <div className="flex-1 flex flex-col border-r border-slate-800">
          <div className="flex-1 relative">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full bg-[#0d1117] text-slate-300 font-mono text-sm p-4 focus:outline-none resize-none"
              spellCheck={false}
            />
          </div>
          
          {/* AI Input for Editor */}
          <div className="p-3 bg-slate-800 border-t border-slate-700">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                placeholder="Ask AI to refactor, fix bugs, or add features..."
                className="flex-1 bg-slate-900 border border-slate-600 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-purple-500 focus:outline-none text-white"
                onKeyDown={(e) => e.key === 'Enter' && handleAiEdit()}
              />
              <button 
                onClick={handleAiEdit}
                disabled={isGenerating || !instruction}
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
              >
                {isGenerating ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles"></i>}
                Generate
              </button>
            </div>
          </div>
        </div>

        {/* Output/Console Column */}
        <div className="h-1/3 md:h-auto md:w-1/3 bg-[#0f172a] flex flex-col">
          <div className="px-4 py-2 bg-slate-800 border-b border-slate-700 text-xs font-bold text-slate-400 uppercase tracking-wider">
            Console / Output
          </div>
          <div className="flex-1 p-4 overflow-auto font-mono text-sm">
            {output ? (
              <pre className={output.startsWith('Error') ? 'text-red-400' : 'text-green-400'}>
                {output}
              </pre>
            ) : (
              <div className="text-slate-600 italic">No output yet. Run code to see results.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeStudio;
