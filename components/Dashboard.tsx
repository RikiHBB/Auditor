import React from 'react';
import type { AnalysisResult, TranscriptSegment } from '../types';
import { MetricCard } from './MetricCard';
import { SentimentChart } from './SentimentChart';
import { Transcription } from './Transcription';
import { Keywords } from './Keywords';
import { Compliance } from './Compliance';
import { UserCircleIcon, MicrophoneIcon, ClockIcon, AdjustmentsIcon, SparklesIcon, DocumentTextIcon, ChartBarIcon, ArrowDownTrayIcon } from './icons/HeroIcons';

interface DashboardProps {
  data: AnalysisResult;
  fileName: string;
}

const getSentimentColor = (sentiment: string) => {
  switch (sentiment?.toLowerCase()) {
    case 'positive':
      return 'text-green-400';
    case 'negative':
      return 'text-red-400';
    default:
      return 'text-yellow-400';
  }
};

const escapeCsvCell = (cell: any): string => {
    if (cell === undefined || cell === null) return '';
    const str = String(cell);
    // If the string contains a comma, a double quote, or a newline, enclose it in double quotes.
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        // Within a double-quoted string, any double quote must be escaped by another double quote.
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
};

const downloadFile = (content: string, fileName: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

export const Dashboard: React.FC<DashboardProps> = ({ data, fileName }) => {
  const { summary, overall_sentiment, metrics, keywords_detected, compliance_check, full_transcript, sentiment_trend } = data;

  const agentTalkPercentage = metrics.talk_to_listen_ratio.agent;
  const customerTalkPercentage = metrics.talk_to_listen_ratio.customer;

  const handleDownloadReport = () => {
    const reportRows = [
        ['Category', 'Metric', 'Value'],
        ['Summary', 'Overall', escapeCsvCell(summary)],
        ['Overall Sentiment', 'Customer', overall_sentiment.customer],
        ['Overall Sentiment', 'Agent', overall_sentiment.agent],
        ['Metrics', 'Talk-to-Listen Agent (%)', metrics.talk_to_listen_ratio.agent.toFixed(1)],
        ['Metrics', 'Talk-to-Listen Customer (%)', metrics.talk_to_listen_ratio.customer.toFixed(1)],
        ['Metrics', 'Silence (%)', metrics.silence_percentage.toFixed(1)],
        ['Metrics', 'Overlap Count', metrics.overlap_count.toString()],
        ['Metrics', 'Agent WPM', metrics.speech_pace.agent_wpm.toString()],
        ['Metrics', 'Customer WPM', metrics.speech_pace.customer_wpm.toString()],
        ['Keywords', 'Detected', escapeCsvCell(keywords_detected.join(', '))]
    ];

    compliance_check.forEach(check => {
        reportRows.push(['Compliance Check', escapeCsvCell(check.phrase), String(check.mentioned)]);
    });

    const csvContent = reportRows.map(row => row.join(',')).join('\n');
    const baseName = fileName.lastIndexOf('.') > -1 ? fileName.substring(0, fileName.lastIndexOf('.')) : fileName;
    const downloadFileName = `analysis-report-${baseName.replace(/\s+/g, '_')}.csv`;
    downloadFile(csvContent, downloadFileName, 'text/csv;charset=utf-8;');
  };
  
  const handleDownloadTranscript = () => {
      const header = ['start_time', 'end_time', 'speaker', 'text', 'sentiment'];
      const transcriptRows = full_transcript.map(segment => [
          segment.start_time,
          segment.end_time,
          segment.speaker,
          escapeCsvCell(segment.text),
          segment.sentiment
      ]);
      
      const csvContent = [header.join(','), ...transcriptRows.map(row => row.join(','))].join('\n');
      const baseName = fileName.lastIndexOf('.') > -1 ? fileName.substring(0, fileName.lastIndexOf('.')) : fileName;
      const downloadFileName = `transcript-${baseName.replace(/\s+/g, '_')}.csv`;
      downloadFile(csvContent, downloadFileName, 'text/csv;charset=utf-8;');
  };

  return (
    <div className="space-y-6 animate-fade-in">
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg flex justify-between items-center">
            <h2 className="text-xl font-bold text-white truncate pr-4">Audit Report for: <span className="text-blue-400">{fileName}</span></h2>
            <button
                onClick={handleDownloadReport}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 flex-shrink-0"
                aria-label="Download analysis report as CSV"
            >
                <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                <span>Download CSV Report</span>
            </button>
        </div>

      {/* Summary */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="flex items-center text-lg font-semibold text-blue-300 mb-3"><SparklesIcon className="w-6 h-6 mr-2" /> AI Summary</h3>
        <p className="text-gray-300 leading-relaxed">{summary}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Customer Sentiment" value={overall_sentiment.customer} icon={<UserCircleIcon />} valueClassName={getSentimentColor(overall_sentiment.customer)} />
        <MetricCard title="Agent Sentiment" value={overall_sentiment.agent} icon={<MicrophoneIcon />} valueClassName={getSentimentColor(overall_sentiment.agent)} />
        <MetricCard title="Silence" value={`${metrics.silence_percentage.toFixed(1)}%`} icon={<ClockIcon />} tooltip="Percentage of silence during call" />
        <MetricCard title="Talk-overs" value={metrics.overlap_count.toString()} icon={<AdjustmentsIcon />} tooltip="Instances of speakers interrupting" />
      </div>

      {/* Talk Ratio */}
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-3 text-center text-gray-300">Talk-to-Listen Ratio</h3>
        <div className="flex w-full h-8 bg-gray-700 rounded-full overflow-hidden">
          <div className="flex items-center justify-center bg-blue-500" style={{ width: `${agentTalkPercentage}%` }} title={`Agent: ${agentTalkPercentage.toFixed(1)}%`}>
            <span className="text-xs font-bold text-white">Agent</span>
          </div>
          <div className="flex items-center justify-center bg-teal-500" style={{ width: `${customerTalkPercentage}%` }} title={`Customer: ${customerTalkPercentage.toFixed(1)}%`}>
             <span className="text-xs font-bold text-white">Customer</span>
          </div>
        </div>
         <div className="flex justify-between mt-2 text-sm text-gray-400">
            <span>Agent: {agentTalkPercentage.toFixed(1)}%</span>
            <span>Customer: {customerTalkPercentage.toFixed(1)}%</span>
        </div>
      </div>
      
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Keywords keywords={keywords_detected} />
            <Compliance checks={compliance_check} />
       </div>


      {/* Sentiment Trend */}
      {sentiment_trend && sentiment_trend.length > 0 && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
             <h3 className="flex items-center text-lg font-semibold text-blue-300 mb-4"><ChartBarIcon className="w-6 h-6 mr-2" /> Sentiment Over Time</h3>
            <SentimentChart data={sentiment_trend} />
          </div>
      )}

      {/* Transcription */}
      {full_transcript && full_transcript.length > 0 && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
             <div className="flex justify-between items-center mb-4">
                <h3 className="flex items-center text-lg font-semibold text-blue-300"><DocumentTextIcon className="w-6 h-6 mr-2" /> Full Transcription</h3>
                 <button
                    onClick={handleDownloadTranscript}
                    className="flex items-center px-3 py-1.5 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 text-sm"
                    aria-label="Download transcript as CSV"
                >
                    <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                    <span>Download Transcript</span>
                </button>
            </div>
            <Transcription transcript={full_transcript} />
          </div>
      )}
    </div>
  );
};