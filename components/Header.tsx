import React from 'react';
import { AtomIcon } from './icons/AtomIcon';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
             <AtomIcon className="h-8 w-8 text-blue-400 animate-spin-slow" />
            <h1 className="ml-3 text-2xl font-bold tracking-tight animate-rainbow-text">AI Voice Call Audit</h1>
          </div>
        </div>
      </div>
    </header>
  );
};