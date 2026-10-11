import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { z } from 'zod';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get('phone');
    
    if (!phone || !z.string().regex(/^\+91[6-9]\d{9}$/).safeParse(phone).success) {
      return NextResponse.json({ error: 'ശരിയായ ഫോൺ നമ്പർ നൽകൂ (+91 XXXXXXXXXX)' }, { status: 400 });
    }

    const snapshot = await adminDb.collection(`farmers/${phone}/diagnoses`)
      .orderBy('timestamp', 'desc')
      .limit(20)
      .get();
      
    const records = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        timestamp: data.timestamp ? data.timestamp.toDate().toISOString() : new Date().toISOString()
      };
    });

    return NextResponse.json(records, { status: 200 });
  } catch (err: any) {
    console.error("History fetching error", err);
    return NextResponse.json({ error: 'വിവരങ്ങൾ ലഭ്യമല്ല' }, { status: 500 });
  }
}
