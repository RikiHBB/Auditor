
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { SentimentTrendPoint } from '../types';

interface SentimentChartProps {
  data: SentimentTrendPoint[];
}

export const SentimentChart: React.FC<SentimentChartProps> = ({ data }) => {
  const formatXAxis = (tickItem: number) => {
    const minutes = Math.floor(tickItem / 60);
    const seconds = tickItem % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: -10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
          <XAxis 
            dataKey="timestamp" 
            stroke="#A0AEC0"
            tickFormatter={formatXAxis}
            label={{ value: 'Call Duration', position: 'insideBottom', offset: -5, fill: '#A0AEC0' }}
          />
          <YAxis 
            stroke="#A0AEC0"
            domain={[-1, 1]}
            label={{ value: 'Sentiment Score', angle: -90, position: 'insideLeft', fill: '#A0AEC0' }}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#2D3748', border: '1px solid #4A5568' }}
            labelStyle={{ color: '#E2E8F0' }}
            formatter={(value: number) => [value.toFixed(2), 'Score']}
            labelFormatter={formatXAxis}
          />
          <Legend wrapperStyle={{ color: '#E2E8F0' }} />
          <Line type="monotone" dataKey="agent_sentiment_score" name="Agent" stroke="#38B2AC" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 6 }} />
          <Line type="monotone" dataKey="customer_sentiment_score" name="Customer" stroke="#4299E1" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 6 }}/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
