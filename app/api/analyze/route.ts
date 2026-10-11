import { NextResponse } from 'next/server';
import { AnalyzeRequestSchema } from '@/utils/validators';
import { analyzeLeafImage, generateTreatmentPlan } from '@/lib/gemini';
import { getCurrentWeather, getWeatherForecast, reverseGeocode } from '@/lib/maps';
import { adminDb, adminStorage, firebaseAdmin } from '@/lib/firebase-admin';
import { DiagnosisRecord, AnalyzeRequest, LocationData, WeatherData, ForecastDay, HistoricalWeather } from '@/types';

export const maxDuration = 60; // Max execution time for Next.js API

export async function POST(req: Request) {
  try {
    const rawBody = await req.json();
    const result = AnalyzeRequestSchema.safeParse(rawBody);
    
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid input', details: result.error.issues }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API key is not configured.' }, { status: 501 });
    }

    if (!adminDb || !adminStorage) {
      return NextResponse.json({ error: 'Firebase Admin is not configured. Please check FIREBASE_ADMIN_KEY.' }, { status: 501 });
    }

    const data: AnalyzeRequest = result.data;
    const { imageBase64, mimeType, phone, lat, lon, audioTranscript } = data;

    // 2. Upload image
    const timestamp = Date.now();
    const bucket = adminStorage.bucket();
    const imageBuffer = Buffer.from(imageBase64, 'base64');
    const imagePath = `diagnoses/${phone}/${timestamp}.jpg`;
    const file = bucket.file(imagePath);
    
    await file.save(imageBuffer, {
      metadata: { contentType: mimeType }
    });
    
    await file.makePublic();
    const imageUrl = file.publicUrl();

    // 3. Gemini Vision
    const diagnosisParams = await analyzeLeafImage(imageBase64, mimeType);

    // 4. Parallel fetch
    const fetchLat = lat || 10.8505;
    const fetchLon = lon || 76.2711;

    const [geoResult, currentResult, forecastResult] = await Promise.allSettled([
      reverseGeocode(fetchLat, fetchLon),
      getCurrentWeather(fetchLat, fetchLon),
      getWeatherForecast(fetchLat, fetchLon)
    ]);

    const location: LocationData = (geoResult.status === 'fulfilled' ? geoResult.value : { lat: fetchLat, lon: fetchLon, village: 'Kerala', district: 'Kerala' }) as LocationData;
    const weather = (currentResult.status === 'fulfilled' ? currentResult.value : { temp: 30, humidity: 70, description: 'Unknown', rain: 0, windSpeed: 0, icon: '' }) as WeatherData;
    const { forecast, history } = (forecastResult.status === 'fulfilled' ? forecastResult.value : { forecast: [], history: { avgRain: 0, avgHumidity: 0 }}) as { forecast: ForecastDay[], history: HistoricalWeather };

    // 5. Treatment Plan
    const treatmentPlan = await generateTreatmentPlan(diagnosisParams, weather, forecast, history, location, audioTranscript);

    // 6. Record
    const record: Omit<DiagnosisRecord, 'id'> = {
      imageUrl,
      audioTranscript: audioTranscript || '',
      crop: diagnosisParams.crop,
      disease: diagnosisParams.disease,
      malayalam_disease: diagnosisParams.malayalam_disease,
      confidence: diagnosisParams.confidence,
      severity: diagnosisParams.severity,
      weather,
      forecast,
      historicalWeather: history,
      location,
      treatmentPlan,
      timestamp: firebaseAdmin.firestore.FieldValue.serverTimestamp() as any,
    };

    // 7. Save
    const docRef = await adminDb.collection(`farmers/${phone}/diagnoses`).add(record);
    await adminDb.doc(`farmers/${phone}`).set({
      phone,
      lastLocation: location,
      lastUpdated: firebaseAdmin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    const finalRecord = { ...record, id: docRef.id, timestamp: new Date().toISOString() };
    
    return NextResponse.json(finalRecord, { status: 200 });

  } catch (err: any) {
    console.error("Analysis Failed", err);
    return NextResponse.json({ error: 'വിശകലനം പരാജയപ്പെട്ടു', details: err.message }, { status: 500 });
  }
}
