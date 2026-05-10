import type { WeatherData, HourlyForecast } from '../types';
import { generateWeatherData, generateHourlyForecast } from '../mockData';

const API_KEY  = process.env.KMA_API_KEY ?? '';
const BASE_URL = 'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0';

/* ── KST 기준 현재 시각 반환 ── */
function getKST(): Date {
  return new Date(new Date().getTime() + 9 * 60 * 60 * 1000);
}

/* ── 현재 날짜·시각 헬퍼 (KST 기준) ── */
function getNowParams(): { baseDate: string; baseTime: string } {
  const now  = getKST();
  const yyyy = now.getUTCFullYear();
  const mm   = String(now.getUTCMonth() + 1).padStart(2, '0');
  const dd   = String(now.getUTCDate()).padStart(2, '0');

  let hh = now.getUTCHours();
  if (now.getUTCMinutes() < 10) hh -= 1;
  if (hh < 0) hh = 23;

  return {
    baseDate: `${yyyy}${mm}${dd}`,
    baseTime: `${String(hh).padStart(2, '0')}00`,
  };
}

/* ── VEC(풍향 각도) → 방위 문자 변환 ── */
function vecToDirection(vec: number): string {
  if (isNaN(vec) || vec < 0) return '북';
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

/* ── 값 유효성 검사 ── */
function isValidWeather(T1H: number, WSD: number): boolean {
  if (isNaN(T1H) || T1H < -50 || T1H > 60)  return false;
  if (isNaN(WSD) || WSD < 0   || WSD > 100) return false;
  return true;
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
      numOfRows:  '10',
      pageNo:     '1',
      dataType:   'JSON',
      base_date:  baseDate,
      base_time:  baseTime,
      nx:         String(nx),
      ny:         String(ny),
    });

    const res = await fetch(`${BASE_URL}/getUltraSrtNcst?${params}`, {
      next: { revalidate: 600 },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const json  = await res.json();
    const items: { category: string; obsrValue: string }[] =
      json?.response?.body?.items?.item ?? [];

    if (!items.length) {
      console.warn('[KMA] 응답 항목 없음 — 목 데이터 fallback');
      return generateWeatherData(beachId);
    }

    const get = (cat: string) =>
      parseFloat(items.find((i) => i.category === cat)?.obsrValue ?? 'NaN');

    const T1H = get('T1H');
    const WSD = get('WSD');
    const VEC = get('VEC');
    const PTY = get('PTY');

    if (!isValidWeather(T1H, WSD)) {
      console.warn(`[KMA] 비정상 값 감지 (T1H:${T1H}, WSD:${WSD}) — 목 데이터 fallback`);
      return generateWeatherData(beachId);
    }

    const kst = getKST();
    kst.setUTCSeconds(0, 0);
    const mock = generateWeatherData(beachId);

    return {
      temperature:   T1H,
      feelsLike:     Math.round((T1H - 0.4 * (T1H - 10) * (1 - WSD / 10)) * 10) / 10,
      waterTemp:     mock.waterTemp,
      windSpeed:     WSD,
      windDirection: vecToDirection(VEC),
      waveHeight:    mock.waveHeight,
      uvIndex:       mock.uvIndex,
      rainProb:      isNaN(PTY) ? 10 : PTY > 0 ? 80 : 10,
      sunrise:       '05:42',
      sunset:        '19:38',
      weatherIcon:   isNaN(PTY) ? 'sunny' : ptyToIcon(PTY),
      updatedAt:     kst.toISOString(),
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
      numOfRows:  '60',
      pageNo:     '1',
      dataType:   'JSON',
      base_date:  baseDate,
      base_time:  baseTime,
      nx:         String(nx),
      ny:         String(ny),
    });

    const res = await fetch(`${BASE_URL}/getUltraSrtFcst?${params}`, {
      next: { revalidate: 600 },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const json  = await res.json();
    const items: { category: string; fcstTime: string; fcstValue: string }[] =
      json?.response?.body?.items?.item ?? [];

    // 디버그 로그
    console.log(`[KMA] ${beachId} 예보 items 수:`, items.length);
    console.log(`[KMA] ${beachId} baseDate:${baseDate} baseTime:${baseTime} nx:${nx} ny:${ny}`);

    if (!items.length) {
      console.warn(`[KMA] ${beachId} 예보 항목 없음 — 목 데이터 fallback`);
      return generateHourlyForecast(beachId);
    }

    const byTime: Record<string, Record<string, string>> = {};
    for (const item of items) {
      if (!byTime[item.fcstTime]) byTime[item.fcstTime] = {};
      byTime[item.fcstTime][item.category] = item.fcstValue;
    }

    console.log(`[KMA] ${beachId} byTime 키 목록:`, Object.keys(byTime).join(', '));

    const result: HourlyForecast[] = [];
    for (const [time, cats] of Object.entries(byTime)) {
      const hh  = time.slice(0, 2);
      const T1H = parseFloat(cats['T1H'] ?? 'NaN');
      const PTY = parseInt(cats['PTY']   ?? '0', 10);
      const RN1 = parseFloat(cats['RN1'] ?? '0');

      console.log(`[KMA] ${beachId} 예보 ${time}: T1H=${T1H}, PTY=${PTY}, RN1=${RN1}`);

      if (isNaN(T1H) || T1H < -50 || T1H > 60) {
        console.warn(`[KMA] ${beachId} 예보 ${time} 비정상 기온 스킵: ${T1H}`);
        continue;
      }

      result.push({
        time:        `${hh}:00`,
        temperature: T1H,
        rainProb:    RN1 > 0 ? 80 : PTY > 0 ? 60 : 10,
        weatherIcon: ptyToIcon(PTY),
      });
    }

    if (!result.length) {
      console.warn(`[KMA] ${beachId} 예보 결과 없음 — 목 데이터 fallback`);
      return generateHourlyForecast(beachId);
    }

    console.log(`[KMA] ${beachId} 예보 최종 결과:`, result.map(r => `${r.time}:${r.temperature}°`).join(', '));
    return result.slice(0, 6);

  } catch (err) {
    console.warn('[KMA] 예보 조회 실패 — 목 데이터 fallback:', err);
    return generateHourlyForecast(beachId);
  }
}
