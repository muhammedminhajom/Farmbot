import { z } from 'zod';

export const AnalyzeRequestSchema = z.object({
  imageBase64: z.string().min(100, "Image data is too short"),
  mimeType: z.string().startsWith('image/'),
  lat: z.number().optional(),
  lon: z.number().optional(),
  phone: z.string().regex(/^\+91[6-9]\d{9}$/, "Invalid Indian phone number"),
  audioTranscript: z.string().optional(),
});

export const TranscribeRequestSchema = z.object({
  audioBase64: z.string().min(100, "Audio data is too short"),
  encoding: z.enum(['WEBM_OPUS', 'OGG_OPUS']),
});

export const DiagnosisResultSchema = z.object({
  crop: z.string().catch("Unknown Crop"),
  disease: z.string().catch("unknown"),
  malayalam_disease: z.string().catch("രോഗം തിരിച്ചറിഞ്ഞില്ല"),
  confidence: z.number().min(0).max(100).catch(0),
  symptoms: z.array(z.string()).catch([]),
  severity: z.enum(['mild', 'moderate', 'severe']).catch('mild'),
  possible_causes: z.array(z.string()).catch([]),
});

export const WeatherDataSchema = z.object({
  temp: z.number(),
  humidity: z.number().min(0).max(100),
  description: z.string(),
  rain: z.number().min(0),
  windSpeed: z.number().min(0),
  icon: z.string(),
});

export const ForecastDaySchema = z.object({
  date: z.string(),
  maxTemp: z.number(),
  minTemp: z.number(),
  humidity: z.number().min(0).max(100),
  rain: z.number().min(0),
  description: z.string(),
});

export const ForecastArraySchema = z.array(ForecastDaySchema).max(5);
