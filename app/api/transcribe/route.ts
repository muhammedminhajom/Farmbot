import { NextResponse } from 'next/server';
import { TranscribeRequestSchema } from '@/utils/validators';
import { transcribeAudio } from '@/lib/speech';

export async function POST(req: Request) {
  try {
    const rawBody = await req.json();
    const result = TranscribeRequestSchema.safeParse(rawBody);
    
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid input', details: result.error.issues }, { status: 400 });
    }

    const { audioBase64, encoding } = result.data;
    const transcription = await transcribeAudio(audioBase64, encoding);
    
    return NextResponse.json(transcription, { status: 200 });
  } catch (err: any) {
    console.error("Transcribe API Error", err);
    return NextResponse.json({ error: 'ശബ്ദം തിരിച്ചറിഞ്ഞില്ല' }, { status: 500 });
  }
}
