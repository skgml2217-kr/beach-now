import { generateWeatherData } from '../mockData';

const OCEAN_API_KEY = process.env.OCEAN_API_KEY ?? '';
const BASE_URL = 'https://apis.data.go.kr/1192136/surveyWaterTemp';

/**
 * 해수욕장 ID → 국립해양조사원 조위관측소 코드 매핑
 * https://www.khoa.go.kr 에서 조위관측소 코드 확인 가능
 */
const BEACH_TO_STATION: Record<string, string> = {
  gyeongpo: '1053', // 강릉
  naksan: '1053', // 양양 (강릉 조위관측소 사용)
  sokcho: '1051', // 속초
  mangsan: '1053', // 동해
  hajodae: '1053', // 양양
  daecheon: '2028', // 보령
  mallipo: '2028', // 태안
  mongsanpo: '2028', // 태안
  eulwangri: '2011', // 인천
  bangpo: '2028', // 태안
  haeundae: '3014', // 부산
  gwangan: '3014', // 부산
  songjeong: '3014', // 부산
  dadaepo: '3014', // 부산
  sangju: '4007', // 여수
  hyeopjae: '5001', // 제주
  hamdeok: '5001', // 제주
  jungmun: '5001', // 서귀포
  iho: '5001', // 제주
  gwakji: '5001', // 제주
};

interface OceanResult {
  waterTemp: number;
  waveHeight: number;
}

export async function fetchOceanData(beachId: string): Promise<OceanResult> {
  const mock = generateWeatherData(beachId);
  const fallback: OceanResult = {
    waterTemp: mock.waterTemp,
    waveHeight: mock.waveHeight,
  };

  if (!OCEAN_API_KEY) {
    console.warn('[OCEAN] API 키 없음 — 목 데이터 사용');
    return fallback;
  }

  const stationCode = BEACH_TO_STATION[beachId];
  if (!stationCode) {
    console.warn(`[OCEAN] ${beachId}에 대한 관측소 코드 없음 — 목 데이터 사용`);
    return fallback;
  }

  try {
    const params = new URLSearchParams({
      ServiceKey: OCEAN_API_KEY,
      ObsCode: stationCode,
      ResultType: 'json',
    });

    const res = await fetch(`${BASE_URL}?${params}`, {
      next: { revalidate: 600 },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const json = await res.json();
    const data = json?.result?.data?.[0];

    if (!data) throw new Error('데이터 없음');

    return {
      waterTemp: parseFloat(data.water_temp ?? String(fallback.waterTemp)),
      waveHeight: parseFloat(data.wave_height ?? String(fallback.waveHeight)),
    };
  } catch (err) {
    console.warn('[OCEAN] 해양 데이터 조회 실패 — 목 데이터 fallback:', err);
    return fallback;
  }
}
