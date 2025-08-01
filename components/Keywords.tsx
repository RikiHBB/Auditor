
import React from 'react';
import { TagIcon } from './icons/HeroIcons';

interface KeywordsProps {
    keywords: string[];
}

export const Keywords: React.FC<KeywordsProps> = ({ keywords }) => {
    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg h-full">
            <h3 className="flex items-center text-lg font-semibold text-blue-300 mb-3"><TagIcon className="w-6 h-6 mr-2" /> Detected Keywords</h3>
            {keywords.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {keywords.map((keyword, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-700 text-gray-200 text-sm rounded-full">
                            {keyword}
                        </span>
                    ))}
                </div>
            ) : (
                <p className="text-gray-400">No specific keywords were detected.</p>
            )}
        </div>
    );
};
