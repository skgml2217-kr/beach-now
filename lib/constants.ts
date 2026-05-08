import type { Region } from './types';

/* ── 지역 탭 순서 ── */
export const REGIONS: Region[] = ['all', 'east', 'west', 'south', 'jeju'];

export const REGION_META: Record<
  Region,
  { label: string; emoji: string; desc: string }
> = {
  all: { label: '전체', emoji: '🗺️', desc: '전국 해수욕장' },
  east: { label: '동해', emoji: '🌅', desc: '강원·경북 해안' },
  west: { label: '서해', emoji: '🌊', desc: '충남·전북 해안' },
  south: { label: '남해', emoji: '🐚', desc: '부산·경남·전남' },
  jeju: { label: '제주', emoji: '🌺', desc: '제주특별자치도' },
};

/* ── 정렬 옵션 ── */
export const SORT_OPTIONS = [
  { value: 'crowd', label: '혼잡도 낮은 순' },
  { value: 'temperature', label: '기온 높은 순' },
  { value: 'name', label: '이름순' },
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number]['value'];

/* ── 날씨 아이콘 매핑 ── */
export const WEATHER_ICON: Record<string, string> = {
  sunny: '☀️',
  partlyCloudy: '⛅',
  cloudy: '☁️',
  rainy: '🌧️',
  stormy: '⛈️',
};

/* ── 자외선 지수 단계 ── */
export const UV_LEVELS = [
  { max: 2, label: '낮음', color: '#7EE8C8' },
  { max: 5, label: '보통', color: '#4DC9E6' },
  { max: 7, label: '높음', color: '#FFD166' },
  { max: 10, label: '매우높음', color: '#FF8C69' },
  { max: 11, label: '위험', color: '#E63946' },
];

/* ── 혼잡도 색상 ── */
export const CROWD_COLOR: Record<string, string> = {
  low: 'bg-secondary/20 text-teal-700',
  medium: 'bg-yellow-100   text-yellow-700',
  high: 'bg-accent/20    text-red-600',
};

/* ── 데이터 출처 ── */
export const DATA_SOURCES = [
  { name: '기상청 날씨마루', url: 'https://www.kma.go.kr' },
  { name: '국립해양조사원', url: 'https://www.khoa.go.kr' },
  { name: '한국관광공사 TourAPI', url: 'https://api.visitkorea.or.kr' },
];

/* ── CCTV 카메라 목록 ── */
export const CCTV_CAMERAS: Record<string, { label: string; url: string }[]> = {
  gyeongpo: [
    { label: '카메라 1', url: 'https://cctv.gbst.go.kr/view/gyeongpo1' },
    { label: '카메라 2', url: 'https://cctv.gbst.go.kr/view/gyeongpo2' },
  ],
  haeundae: [
    { label: '중앙', url: 'https://cctv.haeundae.go.kr/view/center' },
    { label: '동쪽', url: 'https://cctv.haeundae.go.kr/view/east' },
    { label: '서쪽', url: 'https://cctv.haeundae.go.kr/view/west' },
  ],
  gwangan: [
    { label: '카메라 1', url: 'https://cctv.suyeong.go.kr/view/gwangan1' },
  ],
  hyeopjae: [
    { label: '카메라 1', url: 'https://cctv.jeju.go.kr/view/hyeopjae1' },
  ],
  hamdeok: [
    { label: '카메라 1', url: 'https://cctv.jeju.go.kr/view/hamdeok1' },
    { label: '카메라 2', url: 'https://cctv.jeju.go.kr/view/hamdeok2' },
  ],
  daecheon: [
    { label: '카메라 1', url: 'https://cctv.boryeong.go.kr/view/daecheon1' },
  ],
  sokcho: [{ label: '카메라 1', url: 'https://cctv.sokcho.go.kr/view/beach1' }],
};
