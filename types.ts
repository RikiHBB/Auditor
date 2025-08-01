
export interface TranscriptSegment {
  speaker: 'Agent' | 'Customer' | 'Unknown';
  start_time: number;
  end_time: number;
  text: string;
  sentiment: 'Positive' | 'Negative' | 'Neutral';
}

export interface SentimentTrendPoint {
  timestamp: number;
  customer_sentiment_score: number;
  agent_sentiment_score: number;
}

export interface ComplianceCheck {
    phrase: string;
    mentioned: boolean;
}

export interface AnalysisResult {
  summary: string;
  overall_sentiment: {
    customer: 'Positive' | 'Negative' | 'Neutral';
    agent: 'Positive' | 'Negative' | 'Neutral';
  };
  metrics: {
    talk_to_listen_ratio: {
      agent: number;
      customer: number;
    };
    silence_percentage: number;
    overlap_count: number;
    speech_pace: {
       agent_wpm: number;
       customer_wpm: number;
    }
  };
  keywords_detected: string[];
  compliance_check: ComplianceCheck[];
  full_transcript: TranscriptSegment[];
  sentiment_trend: SentimentTrendPoint[];
}
