import React, { useState, useEffect } from 'react';
import { Upload, Image, Maximize2, Save, Download, History, Zap, Trash2, FileCode, FileOutput } from 'lucide-react';
import LoadingSpinner from './components/LoadingSpinner';
import HistoryPanel from './components/HistoryPanel';
import { analyzeCode } from './utils/gemini';
import { AnalysisHistory } from './types';

function App() {
  const [inputCode, setInputCode] = useState('');
  const [analysisResult, setAnalysisResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<AnalysisHistory[]>(() => {
    const saved = localStorage.getItem('analysisHistory');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('analysisHistory', JSON.stringify(history));
  }, [history]);

  const handleAnalyze = async () => {
    if (!inputCode.trim()) return;

    setIsLoading(true);
    try {
      const result = await analyzeCode(inputCode);
      setAnalysisResult(result);

      const newHistoryItem: AnalysisHistory = {
        id: Date.now().toString(),
        inputCode,
        analysisResult: result,
        timestamp: Date.now(),
      };

      setHistory(prev => [newHistoryItem, ...prev]);
    } catch (error) {
      setAnalysisResult('Error analyzing code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleHistorySelect = (item: AnalysisHistory) => {
    setInputCode(item.inputCode);
    setAnalysisResult(item.analysisResult);
    setShowHistory(false);
  };

  const handleHistoryDelete = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
    setInputCode('');
    setAnalysisResult('');
  };

  const handleFullscreen = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element?.requestFullscreen) {
      element.requestFullscreen();
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setInputCode(e.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-slate-900 to-black p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2 text-blue-300">
          <Zap className="w-6 h-6" />
          <span className="text-xl font-semibold">Code Analyzer</span>
        </div>
        <button
          onClick={() => setShowHistory(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-900/30 text-blue-300 rounded-lg hover:bg-blue-800/40 transition-all"
        >
          <History size={18} />
          History
        </button>
      </div>

      <div className="max-w-[1800px] mx-auto">
        <div className="flex gap-6 h-[80vh]">
          {/* Input Panel */}
          <div className="flex-1 relative group transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.6)]">
            <div className="absolute inset-0 bg-blue-500/20 rounded-lg blur-xl group-hover:bg-blue-500/30 transition-all"></div>
            <div className="relative bg-slate-900 rounded-lg h-full border border-blue-500/30 overflow-hidden">
              <div className="flex justify-between items-center px-4 py-2 border-b border-blue-500/30 bg-slate-800/50">
                <div className="flex items-center gap-2 text-blue-300">
                  <FileCode size={18} />
                  <h2 className="font-medium">Input Code</h2>
                </div>
                <div className="flex gap-2">
                  <input
                    type="file"
                    id="fileInput"
                    accept=".txt,.js,.ts,.jsx,.tsx,.py,.java,.cpp,.c,.cs"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <button
                    onClick={() => document.getElementById('fileInput')?.click()}
                    className="p-1.5 hover:bg-blue-500/20 rounded-md text-blue-300"
                    title="Upload File"
                  >
                    <Upload size={18} />
                  </button>
                  <button
                    className="p-1.5 hover:bg-blue-500/20 rounded-md text-blue-300"
                    title="Insert Image"
                  >
                    <Image size={18} />
                  </button>
                  <button
                    onClick={() => handleFullscreen('inputEditor')}
                    className="p-1.5 hover:bg-blue-500/20 rounded-md text-blue-300"
                    title="Fullscreen"
                  >
                    <Maximize2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDownload(inputCode, 'input-code.txt')}
                    className="p-1.5 hover:bg-blue-500/20 rounded-md text-blue-300"
                    title="Download"
                  >
                    <Download size={18} />
                  </button>
                </div>
              </div>
              <div
                id="inputEditor"
                className="w-full h-[calc(100%-3rem)] bg-slate-900/50 p-4"
              >
                <textarea
                  className="w-full h-full bg-slate-800/50 text-blue-100 p-4 resize-none focus:outline-none font-mono rounded-lg border border-blue-500/20 focus:border-blue-500/40 transition-all scrollbar-thin scrollbar-thumb-blue-500/30 scrollbar-track-transparent focus:shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                  placeholder="Paste your code here..."
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Analyze Button */}
          <div className="flex items-center">
            <button
              onClick={handleAnalyze}
              disabled={isLoading || !inputCode.trim()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Zap size={20} className={isLoading ? 'opacity-0' : 'opacity-100'} />
              <span className={isLoading ? 'opacity-50' : 'opacity-100'}>
                Analyze
              </span>
            </button>
          </div>

          {/* Output Panel */}
          <div className="flex-1 relative group transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.6)]">
            <div className="absolute inset-0 bg-blue-500/20 rounded-lg blur-xl group-hover:bg-blue-500/30 transition-all"></div>
            <div className="relative bg-slate-900 rounded-lg h-full border border-blue-500/30 overflow-hidden">
              <div className="flex justify-between items-center px-4 py-2 border-b border-blue-500/30 bg-slate-800/50">
                <div className="flex items-center gap-2 text-blue-300">
                  <FileOutput size={18} />
                  <h2 className="font-medium">Analysis Result</h2>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleFullscreen('outputEditor')}
                    className="p-1.5 hover:bg-blue-500/20 rounded-md text-blue-300"
                    title="Fullscreen"
                  >
                    <Maximize2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDownload(analysisResult, 'analysis-result.txt')}
                    className="p-1.5 hover:bg-blue-500/20 rounded-md text-blue-300"
                    title="Download"
                  >
                    <Download size={18} />
                  </button>
                </div>
              </div>
              <div
                id="outputEditor"
                className="w-full h-[calc(100%-3rem)] bg-slate-900/50 p-4"
              >
                <div 
                    className="w-full h-full bg-slate-800/50 text-blue-100 p-4 font-mono rounded-lg border border-blue-500/20 overflow-auto scrollbar-thin scrollbar-thumb-blue-500/30 scrollbar-track-transparent whitespace-pre-wrap focus:shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                    tabIndex={0} // Allows div to receive focus for the effect
                    style={{ color: analysisResult ? '#E2E8F0' : '#64748B' }}
                >

                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <LoadingSpinner size={50} color="#007bff" />
                    </div>
                  ) : (
                    <div className="h-full">
                      {analysisResult || (
                        <span className="text-slate-500">
                          Waiting for code analysis...
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* History Panel */}
      {showHistory && (
        <HistoryPanel
          history={history}
          onSelect={handleHistorySelect}
          onDelete={handleHistoryDelete}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  );
}

export default App;