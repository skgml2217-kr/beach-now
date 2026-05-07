import Link from 'next/link';
import { Thermometer, Droplets, Waves } from 'lucide-react';
import BeachCard from '@/components/beach/BeachCard';
import { REGION_META, REGIONS } from '@/lib/constants';
import { getRecommendedBeaches, getTopBeaches } from '@/lib/api';
import { MOCK_BEACHES, generateWeatherData } from '@/lib/mockData';
import type { Region } from '@/lib/types';

export default async function HomePage() {
  const recommended = await getRecommendedBeaches();
  const top5 = await getTopBeaches(5);

  /* 전국 평균 날씨 계산 */
  const allWeather = MOCK_BEACHES.map((b) => generateWeatherData(b.id));
  const avg = (key: keyof (typeof allWeather)[0]) =>
    Math.round(
      (allWeather.reduce((s, w) => s + (w[key] as number), 0) /
        allWeather.length) *
        10
    ) / 10;

  const avgTemp = avg('temperature');
  const avgWater = avg('waterTemp');
  const avgWave = avg('waveHeight');

  const today = new Date().toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  return (
    <div className="space-y-16">
      {/* ── 섹션 A: 히어로 배너 (#home-hero) ── */}
      <section
        id="home-hero"
        className="relative -mx-4 px-4 py-16 overflow-hidden
                   bg-gradient-to-br from-primary via-sky-400 to-secondary
                   rounded-3xl text-white text-center"
      >
        {/* 파도 배경 레이어 1 */}
        <svg
          className="absolute bottom-0 left-0 w-[200%] animate-wave opacity-30"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
        >
          <path
            d="M0,40 C360,80 720,0 1080,40 C1260,60 1350,30 1440,40 L1440,80 L0,80 Z"
            fill="white"
          />
        </svg>
        {/* 파도 배경 레이어 2 */}
        <svg
          className="absolute bottom-0 left-0 w-[200%] animate-wave-slow opacity-20"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
        >
          <path
            d="M0,50 C400,10 800,70 1200,30 C1320,10 1400,50 1440,40 L1440,80 L0,80 Z"
            fill="white"
          />
        </svg>

        {/* 콘텐츠 */}
        <div className="relative z-10">
          <p className="text-white/70 text-sm mb-2">{today}</p>
          <h1 className="text-4xl font-bold mb-1">지금 바다는 어때요? 🌊</h1>
          <p className="text-white/80 text-sm mb-8">
            전국 {MOCK_BEACHES.length}개 해수욕장 실시간 현황
          </p>

          {/* 요약 배지 3개 */}
          <div className="flex justify-center gap-3 flex-wrap">
            {[
              {
                icon: <Thermometer size={16} />,
                label: '평균 기온',
                value: `${avgTemp}°C`,
              },
              {
                icon: <Droplets size={16} />,
                label: '평균 수온',
                value: `${avgWater}°C`,
              },
              {
                icon: <Waves size={16} />,
                label: '평균 파고',
                value: `${avgWave}m`,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 bg-navy/50 backdrop-blur
                           px-4 py-2 rounded-full text-sm font-medium"
              >
                {item.icon}
                <span className="text-white/90">{item.label}</span>
                <span className="font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 섹션 B: 오늘의 추천 해수욕장 (#home-recommend) ── */}
      <section id="home-recommend">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-navy">
              오늘 여기 어때요? ☀️
            </h2>
            <p className="text-sm text-navy/50 mt-0.5">
              혼잡도 낮고 날씨 맑은 곳만 골랐어요
            </p>
          </div>
          <Link href="/list" className="text-sm text-primary hover:underline">
            전체 보기 →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {recommended.map((beach) => (
            <BeachCard key={beach.id} beach={beach} />
          ))}
        </div>
      </section>

      {/* ── 섹션 C: 지역별 빠른 탐색 (#home-region-nav) ── */}
      <section id="home-region-nav">
        <h2 className="text-xl font-bold text-navy mb-6">
          어느 바다로 갈까요? 🗺️
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {(REGIONS.filter((r) => r !== 'all') as Region[]).map((r) => {
            const meta = REGION_META[r];
            const count = MOCK_BEACHES.filter((b) => b.region === r).length;
            return (
              <Link
                key={r}
                href={`/list?region=${r}`}
                className="flex flex-col items-center justify-center gap-2
                           bg-white rounded-2xl p-6 shadow-card
                           hover:shadow-hover hover:-translate-y-1
                           transition-all duration-200 text-center"
              >
                <span className="text-4xl">{meta.emoji}</span>
                <span className="font-bold text-navy">{meta.label}</span>
                <span className="text-xs text-navy/40">{count}개 해수욕장</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── 섹션 D: 실시간 인기 TOP 5 (#home-top5) ── */}
      <section id="home-top5">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-navy">지금 핫한 해수욕장 🔥</h2>
          <Link
            href="/list?sort=viewCount"
            className="text-sm text-primary hover:underline"
          >
            전체 보기 →
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-card divide-y divide-navy/5">
          {top5.map((beach, i) => {
            const rank = i + 1;
            const weather = generateWeatherData(beach.id);
            const region = REGION_META[beach.region];
            const RANK_BADGE = ['🥇', '🥈', '🥉'];

            return (
              <Link
                key={beach.id}
                href={`/beach/${beach.id}`}
                className="flex items-center gap-4 px-5 py-4
                           hover:bg-background transition-colors"
              >
                {/* 순위 */}
                <div className="w-8 text-center shrink-0">
                  {rank <= 3 ? (
                    <span className="text-xl">{RANK_BADGE[rank - 1]}</span>
                  ) : (
                    <span className="text-sm font-bold text-navy/30">
                      {rank}
                    </span>
                  )}
                </div>

                {/* 해수욕장 정보 */}
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-navy truncate">
                    {beach.name}
                  </div>
                  <div className="text-xs text-navy/40">
                    {region.emoji} {region.label}
                  </div>
                </div>

                {/* 날씨 + 혼잡도 */}
                <div className="flex items-center gap-3 shrink-0 text-sm">
                  <span className="text-navy/60">
                    <Thermometer size={13} className="inline text-accent" />{' '}
                    {weather.temperature}°
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium
                    ${
                      beach.crowdLevel === 'low'
                        ? 'bg-secondary/20 text-teal-700'
                        : beach.crowdLevel === 'medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-accent/20 text-red-600'
                    }`}
                  >
                    {beach.crowdLevel === 'low'
                      ? '여유'
                      : beach.crowdLevel === 'medium'
                      ? '보통'
                      : '혼잡'}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
