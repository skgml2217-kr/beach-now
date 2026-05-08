import { generateWeatherData } from '../mockData';

const OCEAN_API_KEY = process.env.OCEAN_API_KEY ?? '';
const BASE_URL = 'https://apis.data.go.kr/1192000/olap/tideObsWaterTemp/search.do';

/**
 * 해수욕장 ID → 국립해양조사원 조위관측소 코드 매핑
 * https://www.khoa.go.kr 에서 조위관측소 코드 확인 가능
 */
const BEACH_TO_STATION: Record<string, string> = {
  gyeongpo:  '1053', // 강릉
  naksan:    '1053', // 양양 (강릉 조위관측소 사용)
  sokcho:    '1051', // 속초
  mangsan:   '1053', // 동해
  hajodae:   '1053', // 양양
  daecheon:  '2028', // 보령
  mallipo:   '2028', // 태안
  mongsanpo: '2028', // 태안
  eulwangri: '2011', // 인천
  bangpo:    '2028', // 태안
  haeundae:  '3014', // 부산
  gwangan:   '3014', // 부산
  songjeong: '3014', // 부산
  dadaepo:   '3014', // 부산
  sangju:    '4007', // 여수
  hyeopjae:  '5001', // 제주
  hamdeok:   '5001', // 제주
  jungmun:   '5001', // 서귀포
  iho:       '5001', // 제주
  gwakji:    '5001', // 제주
};

/* ── KST 기준 오늘 날짜 ── */
function getTodayKST(): string {
  const kst = new Date(new Date().getTime() + 9 * 60 * 60 * 1000);
  const yyyy = kst.getUTCFullYear();
  const mm   = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const dd   = String(kst.getUTCDate()).padStart(2, '0');
  return `${yyyy}${mm}${dd}`;
}

interface OceanResult {
  waterTemp:  number;
  waveHeight: number;
}

export async function fetchOceanData(beachId: string): Promise<OceanResult> {
  const mock = generateWeatherData(beachId);
  const fallback: OceanResult = {
    waterTemp:  mock.waterTemp,
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
      serviceKey: OCEAN_API_KEY,
      obsCode:    stationCode,
      dateType:   'D',
      startDate:  getTodayKST(),
      endDate:    getTodayKST(),
      _type:      'json',
    });

    const res = await fetch(`${BASE_URL}?${params}`, {
      next: { revalidate: 600 },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const json  = await res.json();
    const items = json?.response?.body?.items?.item;
    const data  = Array.isArray(items) ? items[items.length - 1] : items;

    if (!data) throw new Error('데이터 없음');

    const waterTemp = parseFloat(data.waterTemp ?? data.water_temp ?? String(fallback.waterTemp));

    // 유효성 검사
    if (isNaN(waterTemp) || waterTemp < 0 || waterTemp > 40) {
      console.warn(`[OCEAN] 비정상 수온값 (${waterTemp}) — 목 데이터 사용`);
      return fallback;
    }

    return {
      waterTemp,
      waveHeight: fallback.waveHeight, // 파고는 별도 API 필요
    };
  } catch (err) {
    console.warn('[OCEAN] 해양 데이터 조회 실패 — 목 데이터 fallback:', err);
    return fallback;
  }
}
