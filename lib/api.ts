import type { Beach, WeatherData, HourlyForecast, Region } from './types';
import { convertLatLngToGrid } from './utils/kmaGrid';
import { fetchCurrentWeather, fetchUltraForecast } from './api/weather';
import { fetchOceanData } from './api/ocean';
import { fetchBeachList } from './api/tour';

/* ── 모듈 레벨 캐시 — 서버 인스턴스 내 재사용 ── */
let beachCache: Beach[] | null = null;

/* ── 해수욕장 목록 ── */
export async function getBeaches(region?: Region): Promise<Beach[]> {
  try {
    // 캐시가 없을 때만 API 호출
    if (!beachCache) {
      beachCache = await fetchBeachList();
      console.log(`[API] 해수욕장 캐시 저장: ${beachCache.length}개`);
    }
    if (!region || region === 'all') return beachCache;
    return beachCache.filter((b) => b.region === region);
  } catch {
    const { MOCK_BEACHES } = await import('./mockData');
    if (!region || region === 'all') return MOCK_BEACHES;
    return MOCK_BEACHES.filter((b) => b.region === region);
  }
}

/* ── 단일 해수욕장 ── */
export async function getBeachById(id: string): Promise<Beach | undefined> {
  const beaches = await getBeaches();
  const found   = beaches.find((b) => b.id === id);
  if (found) return found;

  // TourAPI 결과에 없으면 MOCK_BEACHES에서도 찾기
  const { MOCK_BEACHES } = await import('./mockData');
  return MOCK_BEACHES.find((b) => b.id === id);
}

/* ── 날씨 데이터 ── */
export async function getWeather(beachId: string): Promise<WeatherData> {
  const beaches = await getBeaches();
  let beach     = beaches.find((b) => b.id === beachId);

  if (!beach) {
    const { MOCK_BEACHES } = await import('./mockData');
    beach = MOCK_BEACHES.find((b) => b.id === beachId);
  }

  if (!beach) {
    const { generateWeatherData } = await import('./mockData');
    return generateWeatherData(beachId);
  }

  try {
    const { nx, ny } = convertLatLngToGrid(
      beach.location.lat,
      beach.location.lng
    );
    const [weather, ocean] = await Promise.all([
      fetchCurrentWeather(nx, ny, beachId),
      fetchOceanData(beachId),
    ]);
    return {
      ...weather,
      waterTemp:  ocean.waterTemp,
      waveHeight: ocean.waveHeight,
    };
  } catch (err) {
    console.warn('[API] getWeather 실패 — 목 데이터 fallback:', err);
    const { generateWeatherData } = await import('./mockData');
    return generateWeatherData(beachId);
  }
}

/* ── 시간별 예보 ── */
export async function getHourlyForecast(
  beachId: string
): Promise<HourlyForecast[]> {
  const beaches = await getBeaches();
  let beach     = beaches.find((b) => b.id === beachId);

  if (!beach) {
    const { MOCK_BEACHES } = await import('./mockData');
    beach = MOCK_BEACHES.find((b) => b.id === beachId);
  }

  if (!beach) {
    const { generateHourlyForecast } = await import('./mockData');
    return generateHourlyForecast(beachId);
  }

  try {
    const { nx, ny } = convertLatLngToGrid(
      beach.location.lat,
      beach.location.lng
    );
    return await fetchUltraForecast(nx, ny, beachId);
  } catch (err) {
    console.warn('[API] getHourlyForecast 실패 — 목 데이터 fallback:', err);
    const { generateHourlyForecast } = await import('./mockData');
    return generateHourlyForecast(beachId);
  }
}

/* ── 인기 TOP N ── */
export async function getTopBeaches(limit = 5): Promise<Beach[]> {
  const { MOCK_BEACHES } = await import('./mockData');
  return [...MOCK_BEACHES]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, limit);
}

/* ── 추천 해수욕장 ── */
export async function getRecommendedBeaches(): Promise<Beach[]> {
  const { MOCK_BEACHES } = await import('./mockData');
  return MOCK_BEACHES.filter((b) => b.crowdLevel === 'low').slice(0, 3);
}
