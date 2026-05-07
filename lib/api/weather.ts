import type { WeatherData, HourlyForecast } from '../types';
import { generateWeatherData, generateHourlyForecast } from '../mockData';

const API_KEY = process.env.KMA_API_KEY ?? '';
const BASE_URL = 'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0';

/* ── 현재 날짜·시각 헬퍼 ── */
function getNowParams(): { baseDate: string; baseTime: string } {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');

  // 초단기실황은 매 정시 발표 — 현재 시각의 정시로 맞춤
  let hh = now.getHours();
  // 발표 후 10분 이내면 이전 시각 사용
  if (now.getMinutes() < 10) hh -= 1;
  if (hh < 0) hh = 23;

  return {
    baseDate: `${yyyy}${mm}${dd}`,
    baseTime: `${String(hh).padStart(2, '0')}00`,
  };
}

/* ── VEC(풍향 각도) → 방위 문자 변환 ── */
function vecToDirection(vec: number): string {
  const dirs = ['북', '북동', '동', '남동', '남', '남서', '서', '북서'];
  return dirs[Math.round(vec / 45) % 8];
}

/* ── PTY(강수형태) → weatherIcon 변환 ── */
function ptyToIcon(pty: number): string {
  if (pty === 0) return 'sunny';
  if (pty === 1 || pty === 4) return 'rainy';
  if (pty === 2) return 'stormy';
  return 'cloudy';
}

/* ──────────────────────────────────────
   초단기실황조회 → WeatherData
────────────────────────────────────── */
export async function fetchCurrentWeather(
  nx: number,
  ny: number,
  beachId: string
): Promise<WeatherData> {
  if (!API_KEY) {
    console.warn('[KMA] API 키 없음 — 목 데이터 사용');
    return generateWeatherData(beachId);
  }

  try {
    const { baseDate, baseTime } = getNowParams();
    const params = new URLSearchParams({
      serviceKey: API_KEY,
      numOfRows: '10',
      pageNo: '1',
      dataType: 'JSON',
      base_date: baseDate,
      base_time: baseTime,
      nx: String(nx),
      ny: String(ny),
    });

    const res = await fetch(`${BASE_URL}/getUltraSrtNcst?${params}`, {
      next: { revalidate: 600 },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const json = await res.json();
    const items: { category: string; obsrValue: string }[] =
      json?.response?.body?.items?.item ?? [];

    /* 항목 파싱 */
    const get = (cat: string) =>
      parseFloat(items.find((i) => i.category === cat)?.obsrValue ?? '0');

    const T1H = get('T1H'); // 기온
    const WSD = get('WSD'); // 풍속
    const VEC = get('VEC'); // 풍향
    const PTY = get('PTY'); // 강수형태

    const now = new Date();
    now.setSeconds(0, 0);

    return {
      temperature: T1H,
      feelsLike:
        Math.round((T1H - 0.4 * (T1H - 10) * (1 - WSD / 10)) * 10) / 10,
      waterTemp: generateWeatherData(beachId).waterTemp, // 해양조사원 별도 연동
      windSpeed: WSD,
      windDirection: vecToDirection(VEC),
      waveHeight: generateWeatherData(beachId).waveHeight,
      uvIndex: generateWeatherData(beachId).uvIndex,
      rainProb: PTY > 0 ? 80 : 10,
      sunrise: '05:42',
      sunset: '19:38',
      weatherIcon: ptyToIcon(PTY),
      updatedAt: now.toISOString(),
    };
  } catch (err) {
    console.warn('[KMA] 실황 조회 실패 — 목 데이터 fallback:', err);
    return generateWeatherData(beachId);
  }
}

/* ──────────────────────────────────────
   초단기예보조회 → HourlyForecast[]
────────────────────────────────────── */
export async function fetchUltraForecast(
  nx: number,
  ny: number,
  beachId: string
): Promise<HourlyForecast[]> {
  if (!API_KEY) {
    console.warn('[KMA] API 키 없음 — 목 데이터 사용');
    return generateHourlyForecast(beachId);
  }

  try {
    const { baseDate, baseTime } = getNowParams();
    const params = new URLSearchParams({
      serviceKey: API_KEY,
      numOfRows: '60',
      pageNo: '1',
      dataType: 'JSON',
      base_date: baseDate,
      base_time: baseTime,
      nx: String(nx),
      ny: String(ny),
    });

    const res = await fetch(`${BASE_URL}/getUltraSrtFcst?${params}`, {
      next: { revalidate: 600 },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const json = await res.json();
    const items: { category: string; fcstTime: string; fcstValue: string }[] =
      json?.response?.body?.items?.item ?? [];

    /* 시각별로 그룹핑 */
    const byTime: Record<string, Record<string, string>> = {};
    for (const item of items) {
      if (!byTime[item.fcstTime]) byTime[item.fcstTime] = {};
      byTime[item.fcstTime][item.category] = item.fcstValue;
    }

    const result: HourlyForecast[] = [];
    for (const [time, cats] of Object.entries(byTime)) {
      const hh = time.slice(0, 2);
      const T1H = parseFloat(cats['T1H'] ?? '0');
      const PTY = parseInt(cats['PTY'] ?? '0', 10);
      const RN1 = parseFloat(cats['RN1'] ?? '0');

      result.push({
        time: `${hh}:00`,
        temperature: T1H,
        rainProb: RN1 > 0 ? 80 : PTY > 0 ? 60 : 10,
        weatherIcon: ptyToIcon(PTY),
      });
    }

    return result.slice(0, 6);
  } catch (err) {
    console.warn('[KMA] 예보 조회 실패 — 목 데이터 fallback:', err);
    return generateHourlyForecast(beachId);
  }
}
