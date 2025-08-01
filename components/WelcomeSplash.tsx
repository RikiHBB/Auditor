
import React from 'react';
import { ChartBarIcon, DocumentTextIcon, SparklesIcon, ShieldCheckIcon } from './icons/HeroIcons';

export const WelcomeSplash: React.FC = () => {
  return (
    <div className="text-center p-8 bg-gray-800 rounded-lg animate-fade-in">
      <SparklesIcon className="w-16 h-16 mx-auto text-blue-400 mb-4" />
      <h2 className="text-3xl font-bold text-white mb-2">Welcome to AI Voice Call Audit</h2>
      <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
        Upload a call recording to get instant, in-depth analysis.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-4xl mx-auto">
        <div className="bg-gray-700/50 p-4 rounded-lg flex items-start space-x-3">
          <DocumentTextIcon className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-white">Full Transcription</h3>
            <p className="text-sm text-gray-400">Get timestamped transcripts with speaker identification.</p>
          </div>
        </div>
        <div className="bg-gray-700/50 p-4 rounded-lg flex items-start space-x-3">
          <ChartBarIcon className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-white">Sentiment Analysis</h3>
            <p className="text-sm text-gray-400">Track agent and customer sentiment throughout the call.</p>
          </div>
        </div>
        <div className="bg-gray-700/50 p-4 rounded-lg flex items-start space-x-3">
          <ShieldCheckIcon className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-white">Actionable Insights</h3>
            <p className="text-sm text-gray-400">Identify keywords, check compliance, and get a full summary.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
