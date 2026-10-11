import { TranscribeResponse } from '@/types';

export async function transcribeAudio(audioBase64: string, encoding: string): Promise<TranscribeResponse> {
  const API_KEY = process.env.GOOGLE_CLOUD_STT_KEY;
  if (!API_KEY) throw new Error("STT API key missing");

  const url = `https://speech.googleapis.com/v1/speech:recognize?key=${API_KEY}`;
  
  const body = {
    config: {
      encoding: encoding,
      sampleRateHertz: 48000,
      languageCode: 'ml-IN',
    },
    audio: {
      content: audioBase64,
    },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error('ശബ്ദം തിരിച്ചറിഞ്ഞില്ല');
  }

  const data = await res.json();
  
  if (!data.results || data.results.length === 0) {
    return { transcript: '', confidence: 0, lowConfidence: true };
  }

  const result = data.results[0].alternatives[0];
  const confidence = result.confidence || 0;
  
  return {
    transcript: result.transcript,
    confidence: confidence,
    lowConfidence: confidence < 0.70,
  };
}
