import type { Beach, Region } from '../types';
import { MOCK_BEACHES } from '../mockData';

const TOUR_API_KEY = process.env.TOUR_API_KEY ?? '';
const BASE_URL = 'https://apis.data.go.kr/B551011/KorService1';

/* ── 지역 코드 매핑 ── */
const REGION_AREA_CODE: Partial<Record<Region, string>> = {
  east: '32', // 강원
  west: '34', // 충남
  south: '21', // 부산 (대표)
  jeju: '39', // 제주
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
    id: item.contentid ?? existing?.id ?? String(Math.random()),
    name: item.title ?? existing?.name ?? '해수욕장',
    region,
    location: {
      lat: parseFloat(item.mapy ?? '0'),
      lng: parseFloat(item.mapx ?? '0'),
    },
    address: item.addr1 ?? existing?.address ?? '',
    operationPeriod: existing?.operationPeriod ?? '7월 1일 ~ 8월 31일',
    cctv_url: existing?.cctv_url ?? '',
    crowdLevel: existing?.crowdLevel ?? 'low',
    viewCount: existing?.viewCount ?? 0,
    facilities: existing?.facilities ?? {
      parking: false,
      shower: false,
      locker: false,
      lifeguard: false,
      restaurant: false,
    },
    // TourAPI 이미지
    thumbnail: item.firstimage ?? item.firstimage2 ?? '',
  } as Beach & { thumbnail: string };
}

/* ── 해수욕장 목록 조회 ── */
export async function fetchBeachList(region?: Region): Promise<Beach[]> {
  if (!TOUR_API_KEY) {
    console.warn('[TOUR] API 키 없음 — 목 데이터 사용');
    if (!region || region === 'all') return MOCK_BEACHES;
    return MOCK_BEACHES.filter((b) => b.region === region);
  }

  try {
    const regions =
      region && region !== 'all'
        ? [region]
        : (Object.keys(REGION_AREA_CODE) as Region[]);

    const results = await Promise.all(
      regions.map(async (r) => {
        const areaCode = REGION_AREA_CODE[r];
        if (!areaCode) return [];

        const params = new URLSearchParams({
          serviceKey: TOUR_API_KEY,
          numOfRows: '20',
          pageNo: '1',
          MobileOS: 'ETC',
          MobileApp: 'BeachNow',
          _type: 'json',
          listYN: 'Y',
          arrange: 'A',
          contentTypeId: '12', // 관광지
          areaCode,
          sigunguCode: '',
          cat1: 'A01', // 자연
          cat2: 'A0101', // 자연관광지
          cat3: 'A01011700', // 해수욕장
        });

        const res = await fetch(`${BASE_URL}/areaBasedList1?${params}`, {
          next: { revalidate: 3600 },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();
        const items = json?.response?.body?.items?.item ?? [];

        return (Array.isArray(items) ? items : [items]).map(
          (item: Record<string, string>) => mapTourApiToBeach(item, r)
        );
      })
    );

    const beaches = results.flat();
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
): Promise<{
  address: string;
  operationPeriod: string;
  thumbnail: string;
} | null> {
  if (!TOUR_API_KEY) return null;

  try {
    const params = new URLSearchParams({
      serviceKey: TOUR_API_KEY,
      MobileOS: 'ETC',
      MobileApp: 'BeachNow',
      _type: 'json',
      contentId,
      defaultYN: 'Y',
      firstImageYN: 'Y',
      addrinfoYN: 'Y',
      overviewYN: 'Y',
    });

    const res = await fetch(`${BASE_URL}/detailCommon1?${params}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const json = await res.json();
    const item = json?.response?.body?.items?.item?.[0];
    if (!item) return null;

    return {
      address: item.addr1 ?? '',
      operationPeriod: item.usetime ?? '7월 1일 ~ 8월 31일',
      thumbnail: item.firstimage ?? '',
    };
  } catch (err) {
    console.warn('[TOUR] 상세 조회 실패:', err);
    return null;
  }
}
