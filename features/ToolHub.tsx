import React, { useState, useRef } from 'react';
import { AVAILABLE_TOOLS } from '../constants';
import { ToolType, ModelId } from '../types';
import { generateText, analyzeImage } from '../services/geminiService';

const ToolHub: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolType | null>(null);
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleToolSelect = (type: ToolType) => {
    setActiveTool(type);
    setResult('');
    setInputText('');
    setSelectedImage(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const executeTool = async () => {
    if (!activeTool) return;
    setIsProcessing(true);
    setResult('');

    try {
      if (activeTool === ToolType.SUMMARIZER) {
        const prompt = `Please summarize the following text concisely:\n\n${inputText}`;
        const summary = await generateText(ModelId.GEMINI_FLASH, prompt);
        setResult(summary);
      } else if (activeTool === ToolType.TRANSLATOR) {
        const prompt = `Translate the following text to English (if it's not) or Spanish (if it is English):\n\n${inputText}`;
        const translation = await generateText(ModelId.GEMINI_FLASH, prompt);
        setResult(translation);
      } else if (activeTool === ToolType.VISION_OCR) {
        if (!selectedImage) {
          setResult("Please upload an image first.");
          return;
        }
        const description = await analyzeImage(selectedImage, inputText || "Describe this image in detail and extract any text found.");
        setResult(description);
      }
    } catch (error) {
      setResult("Error processing request. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-200">
      <div className="h-16 border-b border-slate-800 flex items-center px-6 bg-slate-900">
         <h2 className="text-xl font-bold flex items-center gap-2">
            <i className="fa-solid fa-toolbox text-orange-500"></i>
            AI Tools Hub
          </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {!activeTool ? (
          // Tool Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {AVAILABLE_TOOLS.map((tool) => (
              <button
                key={tool.id}
                onClick={() => handleToolSelect(tool.id)}
                className="flex flex-col items-center p-8 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-750 hover:border-blue-500 transition-all group text-center"
              >
                <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <i className={`fa-solid ${tool.icon} text-2xl text-blue-400`}></i>
                </div>
                <h3 className="text-lg font-bold text-slate-100 mb-2">{tool.name}</h3>
                <p className="text-sm text-slate-400">{tool.description}</p>
              </button>
            ))}
          </div>
        ) : (
          // Active Tool Interface
          <div className="max-w-4xl mx-auto bg-slate-800 rounded-xl border border-slate-700 overflow-hidden min-h-[500px] flex flex-col">
            <div className="p-4 border-b border-slate-700 flex items-center justify-between bg-slate-800">
               <h3 className="font-bold text-lg flex items-center gap-2">
                 <i className={`fa-solid ${AVAILABLE_TOOLS.find(t => t.id === activeTool)?.icon} text-blue-400`}></i>
                 {AVAILABLE_TOOLS.find(t => t.id === activeTool)?.name}
               </h3>
               <button 
                 onClick={() => setActiveTool(null)}
                 className="text-slate-400 hover:text-white px-3 py-1 rounded hover:bg-slate-700 text-sm"
               >
                 Back to Tools
               </button>
            </div>

            <div className="p-6 flex-1 flex flex-col gap-6">
              {/* Tool Inputs */}
              <div className="space-y-4">
                {activeTool === ToolType.VISION_OCR && (
                  <div className="flex items-center gap-4">
                     <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-600 border-dashed"
                      >
                        <i className="fa-solid fa-upload mr-2"></i>
                        {selectedImage ? "Change Image" : "Upload Image"}
                      </button>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageUpload} 
                        accept="image/*" 
                        className="hidden"
                      />
                      {selectedImage && (
                        <div className="relative h-16 w-16 rounded overflow-hidden border border-slate-600">
                          <img src={selectedImage} alt="Preview" className="h-full w-full object-cover" />
                        </div>
                      )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    {activeTool === ToolType.VISION_OCR ? "Additional Instructions (Optional)" : "Input Text"}
                  </label>
                  <textarea 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="w-full h-32 bg-slate-900 border border-slate-600 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-blue-500"
                    placeholder={activeTool === ToolType.VISION_OCR ? "E.g., What is written on the sign?" : "Paste text here..."}
                  />
                </div>

                <button 
                  onClick={executeTool}
                  disabled={isProcessing || (activeTool !== ToolType.VISION_OCR && !inputText) || (activeTool === ToolType.VISION_OCR && !selectedImage)}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 text-white py-3 rounded-lg font-bold transition-all shadow-lg shadow-blue-900/20"
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <i className="fa-solid fa-circle-notch animate-spin"></i> Processing...
                    </span>
                  ) : "Run Tool"}
                </button>
              </div>

              {/* Output */}
              {result && (
                <div className="animate-fade-in mt-4">
                  <label className="block text-sm font-medium text-slate-400 mb-2">Result</label>
                  <div className="bg-slate-900 rounded-lg border border-slate-600 p-4 min-h-[100px] whitespace-pre-wrap">
                    {result}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolHub;
