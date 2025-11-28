import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, ModelId } from '../types';
import { ChatSession } from '../services/geminiService';
import ModelSelector from '../components/ModelSelector';

interface ChatInterfaceProps {
  modelId: ModelId;
  setModelId: (id: ModelId) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ modelId, setModelId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hello! I'm your AI assistant. I can help with analysis, coding, writing, and more. Which model would you like to use today?",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Keep chat session ref to maintain context
  const chatSessionRef = useRef<ChatSession | null>(null);

  useEffect(() => {
    // Re-initialize session when model changes
    chatSessionRef.current = new ChatSession(modelId);
  }, [modelId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
        // Fallback if ref is null for some reason
        if (!chatSessionRef.current) {
            chatSessionRef.current = new ChatSession(modelId);
        }

        const responseText = await chatSessionRef.current.sendMessage(userMsg.text);
        
        const botMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'model',
            text: responseText,
            timestamp: Date.now()
        };
        setMessages(prev => [...prev, botMsg]);

    } catch (error) {
        const errorMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'model',
            text: "I encountered an error processing your request. Please try again.",
            timestamp: Date.now(),
            isError: true
        };
        setMessages(prev => [...prev, errorMsg]);
    } finally {
        setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900">
      {/* Header */}
      <div className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <i className="fa-solid fa-message text-blue-500"></i>
          Chat Studio
        </h2>
        <ModelSelector selectedModel={modelId} onSelect={setModelId} disabled={isLoading} />
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-5 py-4 shadow-sm ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : msg.isError 
                    ? 'bg-red-900/20 text-red-200 border border-red-800 rounded-bl-none'
                    : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
              }`}
            >
              <div className="flex items-center gap-2 mb-1 opacity-50 text-xs font-bold uppercase tracking-wider">
                {msg.role === 'user' ? 'You' : 'AI Assistant'}
              </div>
              <div className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 rounded-2xl rounded-bl-none px-6 py-4 border border-slate-700">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-900 border-t border-slate-800">
        <div className="max-w-4xl mx-auto relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="w-full bg-slate-800 text-slate-200 border border-slate-700 rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-[60px] max-h-[150px]"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
          >
            <i className="fa-solid fa-paper-plane text-xs"></i>
          </button>
        </div>
        <div className="text-center mt-2 text-xs text-slate-500">
           AI can make mistakes. Review generated code and facts.
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
