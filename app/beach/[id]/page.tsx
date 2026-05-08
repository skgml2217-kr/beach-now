import type { Metadata } from 'next';
import Link from 'next/link';
import {
  MapPin,
  Calendar,
  ParkingSquare,
  ShowerHead,
  ShieldCheck,
  ChefHat,
  ArrowLeft,
} from 'lucide-react';
import WeatherDashboard from '@/components/beach/WeatherDashboard';
import BeachCard from '@/components/beach/BeachCard';
import CCTVPlayer from '@/components/beach/CCTVPlayer';
import { CrowdBadge } from '@/components/ui/Badge';
import { getBeachById, getWeather, getHourlyForecast } from '@/lib/api';
import { MOCK_BEACHES } from '@/lib/mockData';
import { REGION_META, WEATHER_ICON, CCTV_CAMERAS } from '@/lib/constants';
import { calculateCrowdLevel, getCrowdMessage } from '@/lib/utils/crowdLevel';
import { notFound } from 'next/navigation';
import type { WeatherData } from '@/lib/types';

/* ── 동적 메타데이터 ── */
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const beach = await getBeachById(params.id);
  if (!beach) return { title: '해수욕장을 찾을 수 없어요 | 바다지금' };
  const weather = await getWeather(beach.id);
  return {
    title: `${beach.name} 실시간 현황 | 바다지금`,
    description: `${beach.name} 실시간 CCTV, 현재 기온 ${weather.temperature}°C, 수온 ${weather.waterTemp}°C. 혼잡도와 날씨를 한눈에 확인하세요.`,
    openGraph: {
      title: `${beach.name} 실시간 현황 | 바다지금`,
      description: `지금 ${beach.name}은 어때요? 실시간으로 확인하세요.`,
      images: beach.thumbnail ? [beach.thumbnail] : [],
      locale: 'ko_KR',
      type: 'website',
    },
  };
}

/* ── SSG: 주요 해수욕장 정적 생성 ── */
export async function generateStaticParams() {
  return MOCK_BEACHES.map((beach) => ({ id: beach.id }));
}

export default async function BeachDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const beach = await getBeachById(params.id);
  if (!beach) notFound();

  /* 주변 해수욕장 (같은 지역, 본인 제외, 최대 3개) */
  const nearby = MOCK_BEACHES.filter(
    (b) => b.region === beach.region && b.id !== beach.id
  ).slice(0, 3);

  /* 현재 해수욕장 + 주변 해수욕장 날씨 병렬 fetch */
  const [weather, hourly, ...nearbyWeathers] = await Promise.all([
    getWeather(beach.id),
    getHourlyForecast(beach.id),
    ...nearby.map((b) => getWeather(b.id)),
  ]);

  /* 주변 해수욕장 날씨 맵 */
  const nearbyWeatherMap = Object.fromEntries(
    nearby.map((b, i) => [b.id, nearbyWeathers[i] as WeatherData])
  );

  const region      = REGION_META[beach.region];
  const cameras     = CCTV_CAMERAS[beach.id] ?? [];
  const crowdLevel  = calculateCrowdLevel(beach.id);
  const crowdMessage = getCrowdMessage(crowdLevel);

  /* 편의시설 목록 */
  const facilities = [
    { icon: <ParkingSquare size={14} />, label: '주차장',  ok: beach.facilities.parking },
    { icon: <ShowerHead   size={14} />, label: '샤워장',  ok: beach.facilities.shower },
    { icon: <ShieldCheck  size={14} />, label: '구조대',  ok: beach.facilities.lifeguard },
    { icon: <ChefHat      size={14} />, label: '식당',    ok: beach.facilities.restaurant },
  ];

  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      {/* 뒤로가기 */}
      <Link
        href="/list"
        className="inline-flex items-center gap-1.5 text-sm text-navy/50 hover:text-navy transition-colors"
      >
        <ArrowLeft size={15} /> 목록으로
      </Link>

      {/* 해수욕장명 + 기본 정보 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-sm text-primary font-medium">
            {region.emoji} {region.label}
          </span>
          <h1 className="text-3xl font-bold text-navy mt-1">{beach.name}</h1>
        </div>
        <CrowdBadge level={crowdLevel} />
      </div>

      {/* 혼잡도 배너 */}
      {crowdLevel === 'high' ? (
        <div className="bg-accent/10 border border-accent/20 rounded-2xl px-4 py-3 text-sm text-red-600 font-medium">
          {crowdMessage}
        </div>
      ) : (
        <div className="bg-secondary/10 border border-secondary/20 rounded-2xl px-4 py-3 text-sm text-teal-700 font-medium">
          {crowdMessage}
        </div>
      )}

      {/* ── 섹션 A: CCTV 영상 (#detail-cctv) ── */}
      <section id="detail-cctv">
        <h2 className="text-lg font-bold text-navy mb-3">📹 실시간 CCTV</h2>
        <CCTVPlayer beachName={beach.name} cameras={cameras} />
      </section>

      {/* ── 섹션 B: 날씨 대시보드 (#detail-weather) ── */}
      <section id="detail-weather">
        <h2 className="text-lg font-bold text-navy mb-3">🌤️ 현재 기상 현황</h2>
        <WeatherDashboard weather={weather} />
      </section>

      {/* ── 섹션 C: 시간별 예보 (#detail-hourly) ── */}
      <section id="detail-hourly">
        <h2 className="text-lg font-bold text-navy mb-3">🕐 오늘의 시간별 예보</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {hourly.map((h) => (
            <div
              key={h.time}
              className="shrink-0 bg-white rounded-2xl px-4 py-3 flex flex-col items-center gap-1.5 shadow-card min-w-[90px]"
            >
              <span className="text-xs text-navy/40 font-medium">{h.time}</span>
              <span className="text-2xl">{WEATHER_ICON[h.weatherIcon]}</span>
              <span className="text-sm font-bold text-navy">{h.temperature}°</span>
              <span className="text-xs text-sky-400">💧 {h.rainProb}%</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 섹션 D: 기본 정보 (#detail-info) ── */}
      <section id="detail-info">
        <h2 className="text-lg font-bold text-navy mb-3">ℹ️ 해수욕장 정보</h2>
        <div className="bg-white rounded-2xl shadow-card p-5 space-y-4">
          <div className="flex items-start gap-2 text-sm text-navy/70">
            <MapPin size={15} className="text-accent mt-0.5 shrink-0" />
            <span>{beach.address}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-navy/70">
            <Calendar size={15} className="text-primary shrink-0" />
            <span>운영 기간: {beach.operationPeriod}</span>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {facilities.map((f) => (
              <span
                key={f.label}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium
                  ${f.ok ? 'bg-secondary/20 text-teal-700' : 'bg-navy/5 text-navy/30 line-through'}`}
              >
                {f.icon} {f.label}
              </span>
            ))}
          </div>
          <a
            href={`https://map.kakao.com/link/map/${encodeURIComponent(beach.name)},${beach.location.lat},${beach.location.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-1 px-4 py-2 rounded-full bg-accent text-white text-sm font-medium hover:brightness-105 transition-all"
          >
            🗺️ 카카오맵으로 길찾기
          </a>
        </div>
      </section>

      {/* ── 섹션 E: 주변 해수욕장 (#detail-nearby) ── */}
      {nearby.length > 0 && (
        <section id="detail-nearby">
          <h2 className="text-lg font-bold text-navy mb-3">📍 주변 해수욕장</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {nearby.map((b) => (
              <BeachCard
                key={b.id}
                beach={b}
                weather={nearbyWeatherMap[b.id]}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
