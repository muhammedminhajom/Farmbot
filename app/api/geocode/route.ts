import { NextResponse } from 'next/server';
import { reverseGeocode } from '@/lib/maps';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get('lat') || '');
  const lon = parseFloat(searchParams.get('lon') || '');

  if (isNaN(lat) || isNaN(lon)) {
    return NextResponse.json({ error: 'Invalid coordinates' }, { status: 400 });
  }

  try {
    const data = await reverseGeocode(lat, lon);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ village: 'Kerala', district: 'Kerala' });
  }
}
