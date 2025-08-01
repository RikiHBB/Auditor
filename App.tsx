
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { Dashboard } from './components/Dashboard';
import { Loader } from './components/Loader';
import { WelcomeSplash } from './components/WelcomeSplash';
import { analyzeCall } from './services/geminiService';
import type { AnalysisResult } from './types';

type AppState = 'idle' | 'processing' | 'success' | 'error';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('idle');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.onerror = (err) => reject(err);
    });

  const handleAudioAnalysis = useCallback(async (file: File | null) => {
    if (!file) return;
    
    // Check for supported file types
    if (!['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/x-wav'].includes(file.type)) {
      setError('Invalid file type. Please upload an MP3 or WAV file.');
      setAppState('error');
      return;
    }
    
    setAppState('processing');
    setError(null);
    setAnalysisResult(null);
    setFileName(file.name);

    try {
      const base64Audio = await toBase64(file);
      const resultText = await analyzeCall(base64Audio, file.type);
      
      // Clean the response text from markdown code block markers
      const cleanedJson = resultText.replace(/^```json\s*|```$/g, '').trim();
      
      const result = JSON.parse(cleanedJson) as AnalysisResult;
      setAnalysisResult(result);
      setAppState('success');
    } catch (err) {
      console.error('Analysis failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during analysis.';
      setError(`Failed to analyze audio. ${errorMessage}`);
      setAppState('error');
    }
  }, []);

  const renderContent = () => {
    switch (appState) {
      case 'processing':
        return <Loader message={`Analyzing ${fileName}... This may take a moment.`} />;
      case 'success':
        return analysisResult ? <Dashboard data={analysisResult} fileName={fileName} /> : null;
      case 'error':
        return (
          <div className="text-center p-8 bg-red-900/20 border border-red-500 rounded-lg">
            <h3 className="text-2xl font-bold text-red-400 mb-2">Analysis Failed</h3>
            <p className="text-red-300">{error}</p>
          </div>
        );
      case 'idle':
      default:
        return <WelcomeSplash />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-xl mx-auto mb-8">
           <FileUpload onFileSelect={handleAudioAnalysis} disabled={appState === 'processing'} />
        </div>
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
       <footer className="text-center p-4 text-gray-500 text-sm">
        <p>Powered by Google Gemini</p>
        <p>Created by Venkatesh M Habib</p>
      </footer>
    </div>
  );
};

export default App;
