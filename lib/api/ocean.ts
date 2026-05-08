import { generateWeatherData } from '../mockData';

const OCEAN_API_KEY = process.env.OCEAN_API_KEY ?? '';

/* ── API URL ── */
const WATER_TEMP_URL = 'https://apis.data.go.kr/1192136/surveyWaterTemp/GetSurveyWaterTempApiService';
const WAVE_URL       = 'https://apis.data.go.kr/1192136/noonWave/GetNoonWaveApiService';

/* ── 해수욕장 ID → 수온 관측소 코드 매핑 ── */
const BEACH_TO_TEMP_STATION: Record<string, string> = {
  gyeongpo:  'DT_0028', // 강릉
  naksan:    'DT_0028', // 양양 (강릉 사용)
  sokcho:    'DT_0026', // 속초
  mangsan:   'DT_0028', // 동해
  hajodae:   'DT_0028', // 양양
  daecheon:  'DT_0063', // 보령
  mallipo:   'DT_0063', // 태안
  mongsanpo: 'DT_0063', // 태안
  eulwangri: 'DT_0001', // 인천
  bangpo:    'DT_0063', // 태안
  haeundae:  'DT_0014', // 부산
  gwangan:   'DT_0014', // 부산
  songjeong: 'DT_0014', // 부산
  dadaepo:   'DT_0014', // 부산
  sangju:    'DT_0019', // 여수
  hyeopjae:  'DT_0037', // 제주
  hamdeok:   'DT_0037', // 제주
  jungmun:   'DT_0039', // 서귀포
  iho:       'DT_0037', // 제주
  gwakji:    'DT_0037', // 제주
};

/* ── 해수욕장 ID → 파랑 관측소 코드 매핑 ── */
const BEACH_TO_WAVE_STATION: Record<string, string> = {
  gyeongpo:  'W_0030', // 동해
  naksan:    'W_0030',
  sokcho:    'W_0030',
  mangsan:   'W_0030',
  hajodae:   'W_0030',
  daecheon:  'W_0011', // 서해중부
  mallipo:   'W_0011',
  mongsanpo: 'W_0011',
  eulwangri: 'W_0011',
  bangpo:    'W_0011',
  haeundae:  'W_0041', // 남해동부
  gwangan:   'W_0041',
  songjeong: 'W_0041',
  dadaepo:   'W_0041',
  sangju:    'W_0021', // 남해서부
  hyeopjae:  'W_0051', // 제주
  hamdeok:   'W_0051',
  jungmun:   'W_0051',
  iho:       'W_0051',
  gwakji:    'W_0051',
};

/* ── KST 기준 오늘 날짜 ── */
function getTodayKST(): string {
  const kst  = new Date(new Date().getTime() + 9 * 60 * 60 * 1000);
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

  const tempStation = BEACH_TO_TEMP_STATION[beachId];
  const waveStation = BEACH_TO_WAVE_STATION[beachId];

  if (!tempStation) {
    console.warn(`[OCEAN] ${beachId} 관측소 코드 없음 — 목 데이터 사용`);
    return fallback;
  }

  try {
    const today = getTodayKST();

    /* 수온 + 파고 병렬 호출 */
    const [tempRes, waveRes] = await Promise.all([
      fetch(
        `${WATER_TEMP_URL}?serviceKey=${OCEAN_API_KEY}&obsCode=${tempStation}&startDate=${today}&endDate=${today}&resultType=json`,
        { next: { revalidate: 600 } }
      ),
      waveStation
        ? fetch(
            `${WAVE_URL}?serviceKey=${OCEAN_API_KEY}&obsCode=${waveStation}&startDate=${today}&endDate=${today}&resultType=json`,
            { next: { revalidate: 600 } }
          )
        : Promise.resolve(null),
    ]);

    /* 수온 파싱 */
    let waterTemp = fallback.waterTemp;
    if (tempRes.ok) {
      const tempJson  = await tempRes.json();
      const tempItems = tempJson?.response?.body?.items?.item;
      const tempData  = Array.isArray(tempItems)
        ? tempItems[tempItems.length - 1]
        : tempItems;
      const parsed = parseFloat(tempData?.waterTemp ?? tempData?.water_temp ?? 'NaN');
      if (!isNaN(parsed) && parsed > 0 && parsed < 40) waterTemp = parsed;
    }

    /* 파고 파싱 */
    let waveHeight = fallback.waveHeight;
    if (waveRes && waveRes.ok) {
      const waveJson  = await waveRes.json();
      const waveItems = waveJson?.response?.body?.items?.item;
      const waveData  = Array.isArray(waveItems)
        ? waveItems[waveItems.length - 1]
        : waveItems;
      const parsed = parseFloat(waveData?.waveHeight ?? waveData?.wave_height ?? 'NaN');
      if (!isNaN(parsed) && parsed >= 0 && parsed < 20) waveHeight = parsed;
    }

    console.log(`[OCEAN] ${beachId} 수온: ${waterTemp}°C, 파고: ${waveHeight}m`);
    return { waterTemp, waveHeight };

  } catch (err) {
    console.warn('[OCEAN] 해양 데이터 조회 실패 — 목 데이터 fallback:', err);
    return fallback;
  }
}
