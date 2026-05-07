import type { Beach, WeatherData, HourlyForecast } from './types';

/* ── 해수욕장 목 데이터 20개 ── */
export const MOCK_BEACHES: Beach[] = [
  // 동해 (5개)
  {
    id: 'gyeongpo',
    name: '경포대해수욕장',
    region: 'east',
    location: { lat: 37.7969, lng: 128.9056 },
    address: '강원도 강릉시 안현동 산1-1',
    operationPeriod: '6월 28일 ~ 8월 25일',
    cctv_url: 'https://www.gn.go.kr',
    thumbnail:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
    crowdLevel: 'low',
    viewCount: 9820,
    facilities: {
      parking: true,
      shower: true,
      locker: true,
      lifeguard: true,
      restaurant: true,
    },
  },
  {
    id: 'naksan',
    name: '낙산해수욕장',
    region: 'east',
    location: { lat: 38.1197, lng: 128.6369 },
    address: '강원도 양양군 강현면 낙산리',
    operationPeriod: '7월 1일 ~ 8월 31일',
    cctv_url: 'https://www.yangyang.go.kr',
    thumbnail:
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&q=80',
    crowdLevel: 'medium',
    viewCount: 8540,
    facilities: {
      parking: true,
      shower: true,
      locker: false,
      lifeguard: true,
      restaurant: true,
    },
  },
  {
    id: 'sokcho',
    name: '속초해수욕장',
    region: 'east',
    location: { lat: 38.2044, lng: 128.5928 },
    address: '강원도 속초시 조양동',
    operationPeriod: '7월 1일 ~ 8월 25일',
    cctv_url: 'https://www.sokcho.go.kr',
    thumbnail:
      'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=600&q=80',
    crowdLevel: 'high',
    viewCount: 11200,
    facilities: {
      parking: true,
      shower: true,
      locker: true,
      lifeguard: true,
      restaurant: true,
    },
  },
  {
    id: 'mangsan',
    name: '망상해수욕장',
    region: 'east',
    location: { lat: 37.6025, lng: 129.0811 },
    address: '강원도 동해시 망상동',
    operationPeriod: '7월 1일 ~ 8월 18일',
    cctv_url: 'https://www.dh.go.kr',
    thumbnail:
      'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600&q=80',
    crowdLevel: 'low',
    viewCount: 6300,
    facilities: {
      parking: true,
      shower: true,
      locker: false,
      lifeguard: true,
      restaurant: false,
    },
  },
  {
    id: 'hajodae',
    name: '하조대해수욕장',
    region: 'east',
    location: { lat: 38.0481, lng: 128.6244 },
    address: '강원도 양양군 현북면 하광정리',
    operationPeriod: '7월 5일 ~ 8월 18일',
    cctv_url: 'https://www.yangyang.go.kr',
    thumbnail:
      'https://images.unsplash.com/photo-1662360369501-ef39fbbf471d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    crowdLevel: 'low',
    viewCount: 4100,
    facilities: {
      parking: true,
      shower: false,
      locker: false,
      lifeguard: true,
      restaurant: false,
    },
  },

  // 서해 (5개)
  {
    id: 'daecheon',
    name: '대천해수욕장',
    region: 'west',
    location: { lat: 36.3172, lng: 126.5017 },
    address: '충청남도 보령시 신흑동',
    operationPeriod: '7월 1일 ~ 8월 31일',
    cctv_url: 'https://www.boryeong.go.kr',
    thumbnail:
      'https://images.unsplash.com/photo-1530053969600-caed2596d242?w=600&q=80',
    crowdLevel: 'high',
    viewCount: 13400,
    facilities: {
      parking: true,
      shower: true,
      locker: true,
      lifeguard: true,
      restaurant: true,
    },
  },
  {
    id: 'mallipo',
    name: '만리포해수욕장',
    region: 'west',
    location: { lat: 36.7833, lng: 126.1472 },
    address: '충청남도 태안군 소원면 만리포2길',
    operationPeriod: '7월 1일 ~ 8월 25일',
    cctv_url: 'https://www.taean.go.kr',
    thumbnail:
      'https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=600&q=80',
    crowdLevel: 'medium',
    viewCount: 7800,
    facilities: {
      parking: true,
      shower: true,
      locker: false,
      lifeguard: true,
      restaurant: true,
    },
  },
  {
    id: 'mongsanpo',
    name: '몽산포해수욕장',
    region: 'west',
    location: { lat: 36.6653, lng: 126.2258 },
    address: '충청남도 태안군 남면 몽산포길',
    operationPeriod: '7월 5일 ~ 8월 18일',
    cctv_url: 'https://www.taean.go.kr',
    thumbnail:
      'https://images.unsplash.com/photo-1516939884455-1445c8652f83?w=600&q=80',
    crowdLevel: 'low',
    viewCount: 3900,
    facilities: {
      parking: true,
      shower: false,
      locker: false,
      lifeguard: false,
      restaurant: false,
    },
  },
  {
    id: 'eulwangri',
    name: '을왕리해수욕장',
    region: 'west',
    location: { lat: 37.4494, lng: 126.3803 },
    address: '인천광역시 중구 을왕동',
    operationPeriod: '7월 1일 ~ 8월 31일',
    cctv_url: 'https://www.icjg.go.kr',
    thumbnail:
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&q=80',
    crowdLevel: 'high',
    viewCount: 10500,
    facilities: {
      parking: true,
      shower: true,
      locker: true,
      lifeguard: true,
      restaurant: true,
    },
  },
  {
    id: 'bangpo',
    name: '방포해수욕장',
    region: 'west',
    location: { lat: 36.7972, lng: 126.1394 },
    address: '충청남도 태안군 안면읍 방포리',
    operationPeriod: '7월 1일 ~ 8월 18일',
    cctv_url: 'https://www.taean.go.kr',
    thumbnail:
      'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=600&q=80',
    crowdLevel: 'low',
    viewCount: 2800,
    facilities: {
      parking: true,
      shower: false,
      locker: false,
      lifeguard: true,
      restaurant: false,
    },
  },

  // 남해 (5개)
  {
    id: 'haeundae',
    name: '해운대해수욕장',
    region: 'south',
    location: { lat: 35.1588, lng: 129.1603 },
    address: '부산광역시 해운대구 우동',
    operationPeriod: '7월 1일 ~ 8월 31일',
    cctv_url: 'https://www.haeundae.go.kr',
    thumbnail:
      'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=600&q=80',
    crowdLevel: 'high',
    viewCount: 21000,
    facilities: {
      parking: true,
      shower: true,
      locker: true,
      lifeguard: true,
      restaurant: true,
    },
  },
  {
    id: 'gwangan',
    name: '광안리해수욕장',
    region: 'south',
    location: { lat: 35.1531, lng: 129.1186 },
    address: '부산광역시 수영구 광안해변로',
    operationPeriod: '7월 1일 ~ 8월 31일',
    cctv_url: 'https://www.suyeong.go.kr',
    thumbnail:
      'https://images.unsplash.com/photo-1498598457418-36ef20772bb9?w=600&q=80',
    crowdLevel: 'high',
    viewCount: 18700,
    facilities: {
      parking: true,
      shower: true,
      locker: true,
      lifeguard: true,
      restaurant: true,
    },
  },
  {
    id: 'songjeong',
    name: '송정해수욕장',
    region: 'south',
    location: { lat: 35.1797, lng: 129.2006 },
    address: '부산광역시 해운대구 송정동',
    operationPeriod: '7월 1일 ~ 8월 25일',
    cctv_url: 'https://www.haeundae.go.kr',
    thumbnail:
      'https://images.unsplash.com/photo-1455729552865-3658a5d39692?w=600&q=80',
    crowdLevel: 'medium',
    viewCount: 8900,
    facilities: {
      parking: true,
      shower: true,
      locker: false,
      lifeguard: true,
      restaurant: true,
    },
  },
  {
    id: 'dadaepo',
    name: '다대포해수욕장',
    region: 'south',
    location: { lat: 35.0456, lng: 128.9617 },
    address: '부산광역시 사하구 다대동',
    operationPeriod: '7월 1일 ~ 8월 18일',
    cctv_url: 'https://www.saha.go.kr',
    thumbnail:
      'https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=600&q=80',
    crowdLevel: 'low',
    viewCount: 5600,
    facilities: {
      parking: true,
      shower: true,
      locker: false,
      lifeguard: true,
      restaurant: false,
    },
  },
  {
    id: 'sangju',
    name: '상주은모래비치',
    region: 'south',
    location: { lat: 34.7542, lng: 128.0197 },
    address: '경상남도 남해군 상주면 상주리',
    operationPeriod: '7월 5일 ~ 8월 18일',
    cctv_url: 'https://www.namhae.go.kr',
    thumbnail:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&q=80',
    crowdLevel: 'low',
    viewCount: 3200,
    facilities: {
      parking: true,
      shower: true,
      locker: false,
      lifeguard: true,
      restaurant: false,
    },
  },

  // 제주 (5개)
  {
    id: 'hyeopjae',
    name: '협재해수욕장',
    region: 'jeju',
    location: { lat: 33.3944, lng: 126.2394 },
    address: '제주특별자치도 제주시 한림읍 협재리',
    operationPeriod: '7월 1일 ~ 8월 31일',
    cctv_url: 'https://www.jeju.go.kr',
    thumbnail:
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80',
    crowdLevel: 'medium',
    viewCount: 14200,
    facilities: {
      parking: true,
      shower: true,
      locker: true,
      lifeguard: true,
      restaurant: true,
    },
  },
  {
    id: 'hamdeok',
    name: '함덕해수욕장',
    region: 'jeju',
    location: { lat: 33.5433, lng: 126.6694 },
    address: '제주특별자치도 제주시 조천읍 함덕리',
    operationPeriod: '7월 1일 ~ 8월 31일',
    cctv_url: 'https://www.jeju.go.kr',
    thumbnail:
      'https://images.unsplash.com/photo-1761530072694-72b5ff286288?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    crowdLevel: 'high',
    viewCount: 15800,
    facilities: {
      parking: true,
      shower: true,
      locker: true,
      lifeguard: true,
      restaurant: true,
    },
  },
  {
    id: 'jungmun',
    name: '중문색달해수욕장',
    region: 'jeju',
    location: { lat: 33.2456, lng: 126.4122 },
    address: '제주특별자치도 서귀포시 색달동',
    operationPeriod: '7월 1일 ~ 8월 25일',
    cctv_url: 'https://www.seogwipo.go.kr',
    thumbnail:
      'https://images.unsplash.com/photo-1586500036706-41963de24d8b?w=600&q=80',
    crowdLevel: 'medium',
    viewCount: 12300,
    facilities: {
      parking: true,
      shower: true,
      locker: true,
      lifeguard: true,
      restaurant: true,
    },
  },
  {
    id: 'iho',
    name: '이호테우해수욕장',
    region: 'jeju',
    location: { lat: 33.4947, lng: 126.4358 },
    address: '제주특별자치도 제주시 이호일동',
    operationPeriod: '7월 1일 ~ 8월 18일',
    cctv_url: 'https://www.jeju.go.kr',
    thumbnail:
      'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=600&q=80',
    crowdLevel: 'low',
    viewCount: 6700,
    facilities: {
      parking: true,
      shower: true,
      locker: false,
      lifeguard: true,
      restaurant: false,
    },
  },
  {
    id: 'gwakji',
    name: '곽지과물해수욕장',
    region: 'jeju',
    location: { lat: 33.4153, lng: 126.2419 },
    address: '제주특별자치도 제주시 애월읍 곽지리',
    operationPeriod: '7월 5일 ~ 8월 18일',
    cctv_url: 'https://www.jeju.go.kr',
    thumbnail:
      'https://images.unsplash.com/photo-1474557157379-8aa74a6ef541?w=600&q=80',
    crowdLevel: 'low',
    viewCount: 4400,
    facilities: {
      parking: true,
      shower: true,
      locker: false,
      lifeguard: true,
      restaurant: false,
    },
  },
];

/* ── 날씨 목 데이터 생성 ── */
const WEATHER_ICONS = ['sunny', 'partlyCloudy', 'cloudy', 'rainy'];
const WIND_DIRS = ['북', '북동', '동', '남동', '남', '남서', '서', '북서'];

export function generateWeatherData(beachId: string): WeatherData {
  // beachId를 시드로 사용해 같은 해수욕장은 같은 값 반환
  const seed = beachId.length;
  const rand = (min: number, max: number, offset = 0) =>
    Math.round((min + ((seed + offset) % (max - min + 1))) * 10) / 10;

  const temp = rand(22, 32);
  const now = new Date();
  now.setMinutes(Math.floor(now.getMinutes() / 10) * 10, 0, 0);

  return {
    temperature: temp,
    feelsLike: temp - rand(1, 3, 1),
    waterTemp: rand(18, 26, 2),
    windSpeed: rand(1, 10, 3),
    windDirection: WIND_DIRS[seed % WIND_DIRS.length],
    waveHeight: rand(0.3, 2.0, 4),
    uvIndex: rand(1, 11, 5),
    rainProb: rand(0, 60, 6),
    sunrise: '05:42',
    sunset: '19:38',
    weatherIcon: WEATHER_ICONS[seed % WEATHER_ICONS.length],
    updatedAt: now.toISOString(),
  };
}

/* ── 시간별 예보 생성 ── */
export function generateHourlyForecast(beachId: string): HourlyForecast[] {
  const seed = beachId.length;
  const times = ['06:00', '09:00', '12:00', '15:00', '18:00', '21:00'];
  const temps = [24, 26, 30, 32, 29, 25];

  return times.map((time, i) => ({
    time,
    temperature: temps[i] + (seed % 3) - 1,
    rainProb: [5, 10, 15, 20, 30, 10][i],
    weatherIcon: WEATHER_ICONS[(seed + i) % WEATHER_ICONS.length],
  }));
}
