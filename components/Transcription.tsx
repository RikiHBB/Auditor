
import React from 'react';
import type { TranscriptSegment } from '../types';
import { UserCircleIcon, MicrophoneIcon } from './icons/HeroIcons';

interface TranscriptionProps {
  transcript: TranscriptSegment[];
}

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const getSentimentIndicatorColor = (sentiment: string) => {
  switch (sentiment?.toLowerCase()) {
    case 'positive':
      return 'bg-green-500';
    case 'negative':
      return 'bg-red-500';
    default:
      return 'bg-yellow-500';
  }
};

export const Transcription: React.FC<TranscriptionProps> = ({ transcript }) => {
  return (
    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-4 -mr-4">
      {transcript.map((segment, index) => (
        <div key={index} className="flex items-start space-x-3">
          <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${segment.speaker === 'Agent' ? 'bg-teal-800' : 'bg-blue-800'}`}>
            {segment.speaker === 'Agent' ? <MicrophoneIcon className="w-5 h-5 text-teal-300" /> : <UserCircleIcon className="w-5 h-5 text-blue-300" />}
          </div>
          <div className="flex-1">
             <div className="flex items-center justify-between">
                <span className={`font-bold ${segment.speaker === 'Agent' ? 'text-teal-300' : 'text-blue-300'}`}>{segment.speaker}</span>
                <span className="text-xs text-gray-400">{formatTime(segment.start_time)}</span>
             </div>
             <div className="p-3 mt-1 bg-gray-700/50 rounded-lg rounded-tl-none relative">
                 <p className="text-gray-200">{segment.text}</p>
                 <div 
                    className={`absolute top-2 right-2 w-2.5 h-2.5 rounded-full ${getSentimentIndicatorColor(segment.sentiment)}`}
                    title={`Sentiment: ${segment.sentiment}`}
                 ></div>
             </div>
          </div>
        </div>
      ))}
    </div>
  );
};
