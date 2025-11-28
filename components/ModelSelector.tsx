import React from 'react';
import { ModelId } from '../types';
import { MODEL_OPTIONS } from '../constants';

interface ModelSelectorProps {
  selectedModel: ModelId;
  onSelect: (modelId: ModelId) => void;
  disabled?: boolean;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedModel, onSelect, disabled }) => {
  return (
    <div className="relative inline-block w-full md:w-64">
      <div className="relative">
        <select
          value={selectedModel}
          onChange={(e) => onSelect(e.target.value as ModelId)}
          disabled={disabled}
          className="appearance-none w-full bg-slate-800 border border-slate-700 text-slate-200 py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-medium transition-all disabled:opacity-50"
        >
          {MODEL_OPTIONS.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.name}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
          <i className="fa-solid fa-chevron-down text-xs"></i>
        </div>
      </div>
    </div>
  );
};

export default ModelSelector;
