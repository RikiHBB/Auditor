
import React from 'react';

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  valueClassName?: string;
  tooltip?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, valueClassName = 'text-white', tooltip }) => {
  return (
    <div className="bg-gray-800 p-5 rounded-lg shadow-lg flex items-center space-x-4 transition-transform transform hover:scale-105" title={tooltip}>
      <div className="flex-shrink-0 w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-blue-400">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-400">{title}</p>
        <p className={`text-2xl font-bold ${valueClassName}`}>{value}</p>
      </div>
    </div>
  );
};
