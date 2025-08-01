
import { GoogleGenAI, Type } from "@google/genai";
import type { GenerateContentResponse } from "@google/genai";

// It's assumed that process.env.API_KEY is set in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: 'A concise summary of the call, highlighting the main topic, customer issue, and final resolution.'
    },
    overall_sentiment: {
      type: Type.OBJECT,
      properties: {
        customer: { type: Type.STRING, description: 'Overall sentiment for the customer (Positive, Negative, Neutral).' },
        agent: { type: Type.STRING, description: 'Overall sentiment for the agent (Positive, Negative, Neutral).' }
      },
       required: ['customer', 'agent']
    },
    metrics: {
      type: Type.OBJECT,
      properties: {
        talk_to_listen_ratio: {
          type: Type.OBJECT,
          properties: {
            agent: { type: Type.NUMBER, description: 'Agent talk time as a percentage of total talk time (0-100).' },
            customer: { type: Type.NUMBER, description: 'Customer talk time as a percentage of total talk time (0-100).' }
          },
          required: ['agent', 'customer']
        },
        silence_percentage: {
          type: Type.NUMBER,
          description: 'Percentage of the entire call duration that was silence (0-100).'
        },
        overlap_count: {
          type: Type.INTEGER,
          description: 'Number of times speakers interrupted or talked over each other.'
        },
        speech_pace: {
             type: Type.OBJECT,
             properties: {
                agent_wpm: { type: Type.INTEGER, description: 'Agent average words per minute.'},
                customer_wpm: { type: Type.INTEGER, description: 'Customer average words per minute.'}
             },
             required: ['agent_wpm', 'customer_wpm']
        }
      },
      required: ['talk_to_listen_ratio', 'silence_percentage', 'overlap_count', 'speech_pace']
    },
    keywords_detected: {
      type: Type.ARRAY,
      description: 'List of detected keywords from the provided list: ["refund", "cancellation", "upsell", "technical issue", "feedback", "escalate"].',
      items: { type: Type.STRING }
    },
    compliance_check: {
      type: Type.ARRAY,
      description: 'Check if the mandatory compliance phrase "This call may be recorded for quality assurance" was mentioned.',
      items: {
        type: Type.OBJECT,
        properties: {
          phrase: { type: Type.STRING, description: 'The compliance phrase being checked.' },
          mentioned: { type: Type.BOOLEAN, description: 'True if the phrase was mentioned, false otherwise.' }
        },
        required: ['phrase', 'mentioned']
      }
    },
    full_transcript: {
      type: Type.ARRAY,
      description: 'The full, timestamped transcript with speaker diarization ("Agent" or "Customer") and sentiment analysis for each segment.',
      items: {
        type: Type.OBJECT,
        properties: {
          speaker: { type: Type.STRING, description: 'The speaker ("Agent" or "Customer").' },
          start_time: { type: Type.NUMBER, description: 'Start time of the segment in seconds.' },
          end_time: { type: Type.NUMBER, description: 'End time of the segment in seconds.' },
          text: { type: Type.STRING, description: 'The transcribed text.' },
          sentiment: { type: Type.STRING, description: 'Sentiment of this segment (Positive, Negative, Neutral).' }
        },
        required: ['speaker', 'start_time', 'end_time', 'text', 'sentiment']
      }
    },
    sentiment_trend: {
        type: Type.ARRAY,
        description: "Customer and Agent sentiment analysis at regular time intervals throughout the call. Provide at least 5 data points.",
        items: {
            type: Type.OBJECT,
            properties: {
                timestamp: { type: Type.NUMBER, description: "Timestamp in seconds representing the end of the interval." },
                customer_sentiment_score: { type: Type.NUMBER, description: "Customer sentiment score from -1 (very negative) to 1 (very positive) at this point." },
                agent_sentiment_score: { type: Type.NUMBER, description: "Agent sentiment score from -1 (very negative) to 1 (very positive) at this point." }
            },
            required: ['timestamp', 'customer_sentiment_score', 'agent_sentiment_score']
        }
    }
  },
  required: ['summary', 'overall_sentiment', 'metrics', 'keywords_detected', 'compliance_check', 'full_transcript', 'sentiment_trend']
};

export const analyzeCall = async (base64Audio: string, mimeType: string): Promise<string> => {
  const audioPart = {
    inlineData: {
      mimeType: mimeType,
      data: base64Audio,
    },
  };

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { parts: [audioPart] },
    config: {
      systemInstruction: "You are an expert AI call center quality assurance analyst. Your task is to analyze a call recording between a customer and an agent. Accurately identify who is the 'Agent' and who is the 'Customer'. Provide a detailed audit that strictly follows the provided JSON schema. Ensure all fields are populated accurately.",
      responseMimeType: "application/json",
      responseSchema: analysisSchema,
    },
  });

  return response.text;
};
