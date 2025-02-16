import React from 'react';
import { Trash2 } from 'lucide-react';
import { AnalysisHistory } from '../types';

interface HistoryPanelProps {
  history: AnalysisHistory[];
  onSelect: (item: AnalysisHistory) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ 
  history, 
  onSelect, 
  onDelete, 
  onClose 
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50">
      <div className="absolute right-0 top-0 h-full w-96 bg-slate-900 border-l border-blue-500/30">
        <div className="flex justify-between items-center p-4 border-b border-blue-500/30">
          <h2 className="text-blue-300 font-medium">Analysis History</h2>
          <button 
            onClick={onClose}
            className="text-blue-300 hover:text-blue-100"
          >
            ✕
          </button>
        </div>
        <div className="p-4 space-y-4 h-[calc(100%-4rem)] overflow-auto">
          {history.length === 0 ? (
            <p className="text-blue-300/50 text-center">No history yet</p>
          ) : (
            history.map((item) => (
              <div 
                key={item.id}
                className="group bg-slate-800/50 rounded-lg p-4 border border-blue-500/30 hover:border-blue-500/50 cursor-pointer"
              >
                <div className="flex justify-between items-start mb-2">
                  <div 
                    className="text-blue-300 font-mono text-sm truncate flex-1 mr-2"
                    onClick={() => onSelect(item)}
                  >
                    {item.inputCode.slice(0, 100)}...
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(item.id);
                    }}
                    className="text-blue-300/50 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="text-blue-300/50 text-xs">
                  {new Date(item.timestamp).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryPanel;