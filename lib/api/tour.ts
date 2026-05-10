import type { Beach, Region } from '../types';
import { MOCK_BEACHES } from '../mockData';

const TOUR_API_KEY = process.env.TOUR_API_KEY ?? '';
const BASE_URL     = 'https://apis.data.go.kr/B551011/KorService2';

/* ── 전국 지역 코드 → Region 매핑 ── */
const AREA_CODES: { code: string; region: Region }[] = [
  { code: '32', region: 'east'  }, // 강원
  { code: '34', region: 'west'  }, // 충남
  { code: '2',  region: 'west'  }, // 인천
  { code: '31', region: 'west'  }, // 경기
  { code: '6',  region: 'south' }, // 부산
  { code: '36', region: 'south' }, // 경남
  { code: '38', region: 'south' }, // 전남
  { code: '35', region: 'south' }, // 경북
  { code: '37', region: 'south' }, // 전북
  { code: '5',  region: 'south' }, // 광주
  { code: '7',  region: 'south' }, // 울산
  { code: '39', region: 'jeju'  }, // 제주
];

/* ── Region 필터 → 해당 지역 코드 목록 ── */
const REGION_AREA_CODE: Partial<Record<Region, string>> = {
  east:  '32',
  west:  '34',
  south: '6',
  jeju:  '39',
};

/* ── TourAPI 응답 → Beach 타입 변환 ── */
function mapTourApiToBeach(
  item: Record<string, string>,
  region: Region
): Beach {
  const existing = MOCK_BEACHES.find((b) =>
    b.name.includes(item.title?.slice(0, 4) ?? '')
  );

  return {
    id:              item.contentid ?? existing?.id ?? String(Math.random()),
    name:            item.title    ?? existing?.name ?? '해수욕장',
    region,
    location: {
      lat: parseFloat(item.mapy ?? '0'),
      lng: parseFloat(item.mapx ?? '0'),
    },
    address:         item.addr1    ?? existing?.address ?? '',
    operationPeriod: existing?.operationPeriod ?? '7월 1일 ~ 8월 31일',
    cctv_url:        existing?.cctv_url ?? '',
    crowdLevel:      existing?.crowdLevel ?? 'low',
    viewCount:       existing?.viewCount  ?? 0,
    facilities:      existing?.facilities ?? {
      parking: false, shower: false, locker: false,
      lifeguard: false, restaurant: false,
    },
    thumbnail: item.firstimage ?? item.firstimage2 ?? existing?.thumbnail ?? '',
  } as Beach & { thumbnail: string };
}

/* ── 단일 지역 코드로 해수욕장 목록 조회 ── */
async function fetchByAreaCode(areaCode: string, region: Region): Promise<Beach[]> {
  const params = new URLSearchParams({
    serviceKey:    TOUR_API_KEY,
    numOfRows:     '100',
    pageNo:        '1',
    MobileOS:      'ETC',
    MobileApp:     'BeachNow',
    _type:         'json',
    listYN:        'Y',
    arrange:       'A',
    contentTypeId: '12',
    areaCode,
    cat1:          'A01',
    cat2:          'A0101',
    cat3:          'A01011700',
  });

  const url = `${BASE_URL}/areaBasedList2?${params}`;
  console.log(`[TOUR] 요청 URL (areaCode: ${areaCode}):`, url.slice(0, 150));

  const res = await fetch(url, { cache: 'force-cache' });

  if (!res.ok) throw new Error(`HTTP ${res.status} (areaCode: ${areaCode})`);

  const text = await res.text();
  console.log(`[TOUR] areaCode ${areaCode} 응답 앞부분:`, text.slice(0, 200));

  // XML 응답이면 에러
  if (text.trim().startsWith('<')) {
    console.warn(`[TOUR] areaCode ${areaCode} XML 에러 응답`);
    return [];
  }

  const json       = JSON.parse(text);
  const header     = json?.response?.header;
  const totalCount = json?.response?.body?.totalCount ?? 0;
  const items      = json?.response?.body?.items?.item ?? [];
  const list       = Array.isArray(items) ? items : (items ? [items] : []);

  console.log(`[TOUR] areaCode ${areaCode} header:`, JSON.stringify(header));
  console.log(`[TOUR] areaCode ${areaCode}: 전체 ${totalCount}개 중 ${list.length}개 로드`);

  return list.map((item: Record<string, string>) => mapTourApiToBeach(item, region));
}

/* ── 해수욕장 목록 조회 ── */
export async function fetchBeachList(region?: Region): Promise<Beach[]> {
  if (!TOUR_API_KEY) {
    console.warn('[TOUR] API 키 없음 — 목 데이터 사용');
    if (!region || region === 'all') return MOCK_BEACHES;
    return MOCK_BEACHES.filter((b) => b.region === region);
  }

  try {
    let targets: { code: string; region: Region }[];

    if (region && region !== 'all') {
      targets = AREA_CODES.filter((a) => a.region === region);
      if (!targets.length) {
        const code = REGION_AREA_CODE[region];
        if (code) targets = [{ code, region }];
      }
    } else {
      targets = AREA_CODES;
    }

    const results = await Promise.all(
      targets.map(({ code, region: r }) => fetchByAreaCode(code, r))
    );

    const beaches = results.flat();
    console.log(`[TOUR] 총 ${beaches.length}개 해수욕장 로드 완료`);

    return beaches.length > 0 ? beaches : MOCK_BEACHES;

  } catch (err) {
    console.warn('[TOUR] 목록 조회 실패 — 목 데이터 fallback:', err);
    if (!region || region === 'all') return MOCK_BEACHES;
    return MOCK_BEACHES.filter((b) => b.region === region);
  }
}

/* ── 해수욕장 상세 조회 ── */
export async function fetchBeachDetail(
  contentId: string
): Promise<{ address: string; operationPeriod: string; thumbnail: string } | null> {
  if (!TOUR_API_KEY) return null;

  try {
    const params = new URLSearchParams({
      serviceKey:   TOUR_API_KEY,
      MobileOS:     'ETC',
      MobileApp:    'BeachNow',
      _type:        'json',
      contentId,
      defaultYN:    'Y',
      firstImageYN: 'Y',
      addrinfoYN:   'Y',
      overviewYN:   'Y',
    });

    const res = await fetch(`${BASE_URL}/detailCommon2?${params}`, {
      next: { revalidate: 0 },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const json = await res.json();
    const item = json?.response?.body?.items?.item?.[0];
    if (!item) return null;

    return {
      address:         item.addr1      ?? '',
      operationPeriod: item.usetime    ?? '7월 1일 ~ 8월 31일',
      thumbnail:       item.firstimage ?? '',
    };
  } catch (err) {
    console.warn('[TOUR] 상세 조회 실패:', err);
    return null;
  }
}
