import { Timestamp } from 'firebase/firestore';

export interface DiagnosisResult {
  crop: string;
  disease: string;
  malayalam_disease: string;
  confidence: number;
  symptoms: string[];
  severity: 'mild' | 'moderate' | 'severe';
  possible_causes: string[];
}

export interface WeatherData {
  temp: number;
  humidity: number;
  description: string;
  rain: number;
  windSpeed: number;
  icon: string;
}

export interface ForecastDay {
  date: string;
  maxTemp: number;
  minTemp: number;
  humidity: number;
  rain: number;
  description: string;
}

export interface HistoricalWeather {
  avgRain: number;
  avgHumidity: number;
}

export interface LocationData {
  lat: number;
  lon: number;
  village: string;
  district: string;
}

export interface DiagnosisRecord {
  id?: string;
  imageUrl: string;
  audioTranscript: string;
  crop: string;
  disease: string;
  malayalam_disease: string;
  confidence: number;
  severity: 'mild' | 'moderate' | 'severe';
  weather: WeatherData;
  forecast: ForecastDay[];
  historicalWeather: HistoricalWeather;
  location: LocationData;
  treatmentPlan: string;
  timestamp: string | Date | Timestamp;
  phone?: string;
}

export interface AnalyzeRequest {
  imageBase64: string;
  mimeType: string;
  lat?: number;
  lon?: number;
  phone: string;
  audioTranscript?: string;
}

export interface TranscribeRequest {
  audioBase64: string;
  encoding: 'WEBM_OPUS' | 'OGG_OPUS';
}

export interface TranscribeResponse {
  transcript: string;
  confidence: number;
  lowConfidence: boolean;
}

export type DiagnosisProgress =
  | 'idle'
  | 'uploading'
  | 'analyzing'
  | 'weather'
  | 'generating'
  | 'saving'
  | 'done'
  | 'error';
