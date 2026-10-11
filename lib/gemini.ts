import { GoogleGenerativeAI } from '@google/generative-ai';
import { DiagnosisResult, WeatherData, ForecastDay, HistoricalWeather, LocationData } from '@/types';
import { DiagnosisResultSchema } from '@/utils/validators';

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function analyzeLeafImage(imageBase64: string, mimeType: string): Promise<DiagnosisResult> {
  const model = ai.getGenerativeModel({ model: 'gemini-1.5-pro' });
  
  const prompt = `You are an expert agricultural plant pathologist.
Analyze this leaf image and return ONLY valid JSON with no explanation, 
no markdown, no code fences:
{
  "crop": "<English crop name>",
  "disease": "<English disease name>",
  "malayalam_disease": "<disease name in Malayalam script>",
  "confidence": <integer 0-100>,
  "symptoms": ["<observed symptom 1>", "<observed symptom 2>"],
  "severity": "mild" or "moderate" or "severe",
  "possible_causes": ["<cause 1>", "<cause 2>"]
}
If the image is blurry, not a leaf, or disease is unidentifiable:
{ "disease": "unknown" }`;

  const imagePart = {
    inlineData: {
      data: imageBase64,
      mimeType
    }
  };

  const backoffs = [1000, 2000, 4000];
  
  for (let i = 0; i <= backoffs.length; i++) {
    try {
      const result = await model.generateContent([prompt, imagePart]);
      const responseText = result.response.text().trim();
      let rawJson = responseText;
      
      if (responseText.startsWith('```json')) {
        rawJson = responseText.replace(/```json\n/g, '').replace(/```$/g, '');
      } else if (responseText.startsWith('```')) {
         rawJson = responseText.replace(/```\n/g, '').replace(/```$/g, '');
      }
      
      const parsed = JSON.parse(rawJson);
      if (parsed.disease === 'unknown') {
         return {
           crop: 'Unknown',
           disease: 'unknown',
           malayalam_disease: 'രോഗം തിരിച്ചറിഞ്ഞില്ല',
           confidence: 0,
           symptoms: [],
           severity: 'mild',
           possible_causes: []
         };
      }
      return DiagnosisResultSchema.parse(parsed) as DiagnosisResult;
    } catch (e) {
      if (i === backoffs.length) break;
      await delay(backoffs[i]);
    }
  }
  
  return {
     crop: 'Unknown',
     disease: 'unknown',
     malayalam_disease: 'രോഗം തിരിച്ചറിഞ്ഞില്ല',
     confidence: 0,
     symptoms: [],
     severity: 'mild',
     possible_causes: []
  };
}

export async function generateTreatmentPlan(
  diseaseParams: DiagnosisResult,
  weather: WeatherData,
  forecast: ForecastDay[],
  history: HistoricalWeather,
  location: LocationData,
  audioTranscript: string = ''
): Promise<string> {
  const model = ai.getGenerativeModel({ model: 'gemini-1.5-pro' });
  
  const forecastSummary = forecast.map(f => `${f.date}: ${f.maxTemp}°C, ${f.rain}mm rain`).join(' | ');
  
  let prompt = `You are a friendly agricultural advisor for Kerala farmers.
Speak warmly in simple Malayalam, like a trusted neighbor.
Address the farmer as 'ചേട്ടാ'.

Disease: ${diseaseParams.disease} (${diseaseParams.malayalam_disease})
Crop: ${diseaseParams.crop} | Severity: ${diseaseParams.severity}
Location: ${location.village}, ${location.district}, Kerala
Current weather: ${weather.temp}°C, ${weather.humidity}% humidity, ${weather.description}
Past 7 days: avg rainfall ${history.avgRain}mm/day, avg humidity ${history.avgHumidity}%
Next 5 days forecast: ${forecastSummary}
`;

  if (audioTranscript) {
      prompt += `\nFarmer's voice note (translate/consider this context): "${audioTranscript}"\n`;
  }

  prompt += `
Write a structured treatment plan in simple Malayalam with exactly 
these 6 sections, using bullet points:

1. 🌿 രോഗം എന്താണ്
   (explain the disease simply, what it does to the plant)

2. 🌧️ ഇത് ഇപ്പോൾ കൂടുതലായ കാരണം
   (connect current weather conditions to why disease is spreading now)

3. 💊 ഉടനടി ചെയ്യേണ്ടത്
   (give both organic AND chemical treatment options with exact dosage 
    and how many days to apply)

4. 🗓️ 5 ദിവസത്തെ പ്ലാൻ
   (day-by-day action plan based on the 5-day weather forecast)

5. 🚫 ചെയ്യരുതാത്തത്
   (what NOT to do — common mistakes that make it worse)

6. 📞 കൂടുതൽ സഹായത്തിന്
   (advise visiting local Krishi Bhavan, mention they are free and helpful)

Maximum 400 words total. Use simple language a farmer can understand.`;

  const backoffs = [1000, 2000, 4000];
  
  for (let i = 0; i <= backoffs.length; i++) {
    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (e) {
      if (i === backoffs.length) throw new Error("GEMINI_FAILURE");
      await delay(backoffs[i]);
    }
  }
  return "Error generating treatment plan.";
}
