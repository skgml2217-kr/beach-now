/* ── 지역 ── */
export type Region = 'all' | 'east' | 'west' | 'south' | 'jeju';

export const REGION_LABEL: Record<Region, string> = {
  all: '전체',
  east: '동해',
  west: '서해',
  south: '남해',
  jeju: '제주',
};

/* ── 혼잡도 ── */
export type CrowdLevel = 'low' | 'medium' | 'high';

export const CROWD_LABEL: Record<CrowdLevel, string> = {
  low: '여유',
  medium: '보통',
  high: '혼잡',
};

/* ── 해수욕장 ── */
export interface Location {
  lat: number;
  lng: number;
}

export interface Facilities {
  parking: boolean;
  shower: boolean;
  locker: boolean;
  lifeguard: boolean;
  restaurant: boolean;
}

export interface Beach {
  id: string;
  name: string;
  region: Region;
  location: Location;
  cctv_url: string;
  address: string;
  operationPeriod: string;
  facilities: Facilities;
  crowdLevel: CrowdLevel;
  viewCount: number;
  thumbnail?: string; // 해수욕장 대표 이미지 URL
}

/* ── 날씨 ── */
export interface WeatherData {
  temperature: number; // °C
  feelsLike: number; // 체감온도 °C
  waterTemp: number; // 수온 °C
  windSpeed: number; // m/s
  windDirection: string; // ex. "북동"
  waveHeight: number; // m
  uvIndex: number; // 0~11
  rainProb: number; // %
  sunrise: string; // "HH:MM"
  sunset: string; // "HH:MM"
  weatherIcon: string; // ex. "sunny" | "cloudy" | "rainy"
  updatedAt: string; // ISO string
}

/* ── 시간별 예보 ── */
export interface HourlyForecast {
  time: string; // "06:00"
  temperature: number;
  rainProb: number;
  weatherIcon: string;
}

/* ── API 응답 래퍼 ── */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}
