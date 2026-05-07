import {
  Thermometer,
  Droplets,
  Wind,
  Waves,
  Sun,
  CloudRain,
  Sunrise,
} from 'lucide-react';
import { UV_LEVELS } from '@/lib/constants';
import type { WeatherData } from '@/lib/types';

interface Props {
  weather: WeatherData;
}

/* 자외선 단계 계산 */
function getUvLevel(uv: number) {
  return UV_LEVELS.find((l) => uv <= l.max) ?? UV_LEVELS[UV_LEVELS.length - 1];
}

/* 날씨 카드 단위 컴포넌트 */
function WeatherItem({
  icon,
  label,
  value,
  sub,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="bg-background rounded-2xl p-4 flex flex-col gap-1">
      <div className="flex items-center gap-1.5 text-xs text-navy/50 font-medium">
        {icon} {label}
      </div>
      <div className="text-2xl font-bold text-navy">{value}</div>
      {sub && <div className="text-xs text-navy/40">{sub}</div>}
      {children}
    </div>
  );
}

export default function WeatherDashboard({ weather }: Props) {
  const uvLevel = getUvLevel(weather.uvIndex);
  const uvPct = Math.round((weather.uvIndex / 11) * 100);
  const updated = new Date(weather.updatedAt).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div>
      {/* 갱신 시각 */}
      <div className="flex justify-end mb-3 text-xs text-navy/40">
        🔄 10분마다 자동 갱신 &nbsp;|&nbsp; 마지막 업데이트: {updated}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* 기온 */}
        <WeatherItem
          icon={<Thermometer size={13} className="text-accent" />}
          label="기온"
          value={`${weather.temperature}°C`}
          sub={`체감 ${weather.feelsLike}°C`}
        />

        {/* 수온 */}
        <WeatherItem
          icon={<Droplets size={13} className="text-primary" />}
          label="수온"
          value={`${weather.waterTemp}°C`}
        />

        {/* 풍속 */}
        <WeatherItem
          icon={<Wind size={13} className="text-secondary" />}
          label="풍속 / 풍향"
          value={`${weather.windSpeed}m/s`}
          sub={`${weather.windDirection}풍`}
        />

        {/* 파고 */}
        <WeatherItem
          icon={<Waves size={13} className="text-primary" />}
          label="파고"
          value={`${weather.waveHeight}m`}
        >
          {/* 파도 시각화 */}
          <div className="flex items-end gap-0.5 h-5 mt-1">
            {[0.4, 0.7, 1, 0.6, 0.9, 0.5].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm bg-primary/40 animate-wave"
                style={{
                  height: `${h * Math.min(weather.waveHeight / 2, 1) * 100}%`,
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        </WeatherItem>

        {/* 자외선 */}
        <WeatherItem
          icon={<Sun size={13} className="text-yellow-400" />}
          label="자외선 지수"
          value={`${weather.uvIndex}`}
          sub={uvLevel.label}
        >
          <div className="mt-1 h-1.5 bg-navy/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${uvPct}%`, background: uvLevel.color }}
            />
          </div>
        </WeatherItem>

        {/* 강수확률 */}
        <WeatherItem
          icon={<CloudRain size={13} className="text-sky-400" />}
          label="강수확률"
          value={`${weather.rainProb}%`}
        />

        {/* 일출/일몰 */}
        <WeatherItem
          icon={<Sunrise size={13} className="text-orange-400" />}
          label="일출 / 일몰"
          value={weather.sunrise}
          sub={`일몰 ${weather.sunset}`}
        />

        {/* 날씨 요약 */}
        <div className="bg-background rounded-2xl p-4 flex flex-col items-center justify-center gap-1">
          <span className="text-4xl">
            {weather.weatherIcon === 'sunny'
              ? '☀️'
              : weather.weatherIcon === 'partlyCloudy'
              ? '⛅'
              : weather.weatherIcon === 'cloudy'
              ? '☁️'
              : weather.weatherIcon === 'rainy'
              ? '🌧️'
              : '⛈️'}
          </span>
          <span className="text-xs text-navy/50 font-medium">현재 날씨</span>
        </div>
      </div>
    </div>
  );
}
