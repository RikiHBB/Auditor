
import React from 'react';
import type { ComplianceCheck } from '../types';
import { ShieldCheckIcon, ShieldExclamationIcon, ClipboardCheckIcon } from './icons/HeroIcons';


interface ComplianceProps {
    checks: ComplianceCheck[];
}

export const Compliance: React.FC<ComplianceProps> = ({ checks }) => {
    return (
         <div className="bg-gray-800 p-6 rounded-lg shadow-lg h-full">
            <h3 className="flex items-center text-lg font-semibold text-blue-300 mb-4"><ClipboardCheckIcon className="w-6 h-6 mr-2" /> Compliance Check</h3>
            <ul className="space-y-3">
                {checks.map((check, index) => (
                    <li key={index} className="flex items-center justify-between">
                        <span className="text-gray-300 italic">"{check.phrase}"</span>
                        {check.mentioned ? (
                            <span className="flex items-center text-sm font-medium text-green-400">
                                <ShieldCheckIcon className="w-5 h-5 mr-1.5" />
                                Mentioned
                            </span>
                        ) : (
                            <span className="flex items-center text-sm font-medium text-red-400">
                                <ShieldExclamationIcon className="w-5 h-5 mr-1.5" />
                                Not Mentioned
                            </span>
                        )}
                    </li>
                ))}
                 {checks.length === 0 && <p className="text-gray-400">No compliance rules configured.</p>}
            </ul>
        </div>
    );
};
