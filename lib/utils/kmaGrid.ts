/**
 * 위경도 → 기상청 격자 좌표 변환 (Lambert Conformal Conic Projection)
 * 기상청 공식 변환 공식 기반
 */

const GRID = {
  RE: 6371.00877, // 지구 반경 (km)
  GRID: 5.0, // 격자 간격 (km)
  SLAT1: 30.0, // 표준위도 1
  SLAT2: 60.0, // 표준위도 2
  OLON: 126.0, // 기준점 경도
  OLAT: 38.0, // 기준점 위도
  XO: 43, // 기준점 X 격자
  YO: 136, // 기준점 Y 격자
};

const DEGRAD = Math.PI / 180.0;

export function convertLatLngToGrid(
  lat: number,
  lng: number
): { nx: number; ny: number } {
  const { RE, GRID: grid, SLAT1, SLAT2, OLON, OLAT, XO, YO } = GRID;

  const re = RE / grid;
  const slat1 = SLAT1 * DEGRAD;
  const slat2 = SLAT2 * DEGRAD;
  const olon = OLON * DEGRAD;
  const olat = OLAT * DEGRAD;

  let sn =
    Math.tan(Math.PI * 0.25 + slat2 * 0.5) /
    Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);

  let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sf = (Math.pow(sf, sn) * Math.cos(slat1)) / sn;

  let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
  ro = (re * sf) / Math.pow(ro, sn);

  const ra = Math.tan(Math.PI * 0.25 + lat * DEGRAD * 0.5);
  const raP = (re * sf) / Math.pow(ra, sn);

  let theta = lng * DEGRAD - olon;
  if (theta > Math.PI) theta -= 2.0 * Math.PI;
  if (theta < -Math.PI) theta += 2.0 * Math.PI;
  theta *= sn;

  const nx = Math.floor(raP * Math.sin(theta) + XO + 0.5);
  const ny = Math.floor(ro - raP * Math.cos(theta) + YO + 0.5);

  return { nx, ny };
}
