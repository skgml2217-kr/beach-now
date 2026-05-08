import { NextResponse } from 'next/server';
import { getWeather } from '@/lib/api';

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const weather = await getWeather(params.id);
    return NextResponse.json(weather);
  } catch (err) {
    return NextResponse.json(
      { error: '날씨 데이터를 불러올 수 없습니다.' },
      { status: 500 }
    );
  }
}
