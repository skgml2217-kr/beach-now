'use client';

import Link from 'next/link';
import { Thermometer, Droplets, Wind } from 'lucide-react';
import { CrowdBadge } from '@/components/ui/Badge';
import { REGION_META, WEATHER_ICON } from '@/lib/constants';
import { generateWeatherData } from '@/lib/mockData';
import type { Beach } from '@/lib/types';

interface BeachCardProps {
  beach: Beach & { thumbnail?: string };
  rank?: number;
}

const RANK_STYLE = ['', '🥇', '🥈', '🥉', '4', '5'];

export default function BeachCard({ beach, rank }: BeachCardProps) {
  const weather = generateWeatherData(beach.id);
  const region = REGION_META[beach.region];

  return (
    <Link
      href={`/beach/${beach.id}`}
      className="group block bg-white rounded-2xl shadow-card overflow-hidden
                 hover:shadow-hover transition-all duration-200 hover:-translate-y-1"
    >
      {/* 썸네일 */}
      <div className="relative h-44 bg-gradient-to-br from-primary/30 to-secondary/40 overflow-hidden">
        {/* 순위 배지 */}
        {rank && (
          <div className="absolute top-2 left-2 z-10">
            {rank <= 3 ? (
              <span className="text-2xl">{RANK_STYLE[rank]}</span>
            ) : (
              <span
                className="bg-white/80 backdrop-blur text-navy font-bold text-sm
                               w-7 h-7 rounded-full flex items-center justify-center shadow"
              >
                {rank}
              </span>
            )}
          </div>
        )}

        {/* 혼잡도 배지 */}
        <div className="absolute top-2 right-2 z-10">
          <CrowdBadge level={beach.crowdLevel} />
        </div>

        {/* 이미지 or 플레이스홀더 */}
        {beach.thumbnail ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={beach.thumbnail}
            alt={beach.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl opacity-40 group-hover:scale-110 transition-transform duration-300">
              🏖️
            </span>
          </div>
        )}

        {/* 어두운 오버레이 */}
        {beach.thumbnail && <div className="absolute inset-0 bg-navy/10" />}

        {/* 하단 그라데이션 */}
        <div
          className="absolute bottom-0 inset-x-0 h-12
                        bg-gradient-to-t from-white/60 to-transparent"
        />
      </div>

      {/* 카드 본문 */}
      <div className="p-4">
        {/* 지역 + 해수욕장명 */}
        <div className="mb-3">
          <span className="text-xs text-primary font-medium">
            {region.emoji} {region.label}
          </span>
          <h3 className="text-navy font-bold text-base leading-tight mt-0.5">
            {beach.name}
          </h3>
        </div>

        {/* 날씨 요약 */}
        <div className="flex items-center gap-3 text-sm text-navy/70">
          <span className="flex items-center gap-1">
            <Thermometer size={14} className="text-accent" />
            {weather.temperature}°
          </span>
          <span className="flex items-center gap-1">
            <Droplets size={14} className="text-primary" />
            수온 {weather.waterTemp}°
          </span>
          <span className="flex items-center gap-1">
            <Wind size={14} className="text-secondary" />
            {weather.windSpeed}m/s
          </span>
          <span className="ml-auto text-base">
            {WEATHER_ICON[weather.weatherIcon]}
          </span>
        </div>
      </div>
    </Link>
  );
}
