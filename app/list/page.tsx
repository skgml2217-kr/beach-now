'use client';

import {
  useState,
  useMemo,
  useEffect,
  useDeferredValue,
  Suspense,
} from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal } from 'lucide-react';
import BeachCard from '@/components/beach/BeachCard';
import { MOCK_BEACHES } from '@/lib/mockData';
import { SORT_OPTIONS } from '@/lib/constants';
import type { Region, WeatherData } from '@/lib/types';

function ListContent() {
  const searchParams = useSearchParams();

  const initRegion = (searchParams.get('region') ?? 'all') as Region;
  const initQuery  = searchParams.get('q') ?? '';

  const [region,  setRegion]  = useState<Region>(initRegion);
  const [sort,    setSort]    = useState<string>('crowd');
  const [query,   setQuery]   = useState(initQuery);
  const [weatherMap, setWeatherMap] = useState<Record<string, WeatherData>>({});

  const deferredQuery = useDeferredValue(query);

  // URL 파라미터 변경 시 동기화
  useEffect(() => {
    const r = (searchParams.get('region') ?? 'all') as Region;
    const q = searchParams.get('q') ?? '';
    setRegion(r);
    setQuery(q);
  }, [searchParams]);

  // 날씨 데이터 fetch
  useEffect(() => {
    const fetchWeathers = async () => {
      try {
        const results = await Promise.all(
          MOCK_BEACHES.map(async (b) => {
            const res = await fetch(`/api/weather/${b.id}`);
            if (!res.ok) return null;
            const data = await res.json();
            return [b.id, data] as [string, WeatherData];
          })
        );
        const map = Object.fromEntries(
          results.filter((r): r is [string, WeatherData] => r !== null)
        );
        setWeatherMap(map);
      } catch (err) {
        console.warn('[List] 날씨 fetch 실패:', err);
      }
    };
    fetchWeathers();
  }, []);

  const filtered = useMemo(() => {
    let list = [...MOCK_BEACHES];
    if (region !== 'all') list = list.filter((b) => b.region === region);
    if (deferredQuery.trim()) {
      const q = deferredQuery.trim().toLowerCase();
      list = list.filter((b) => b.name.toLowerCase().includes(q));
    }
    if (sort === 'crowd') {
      const order = { low: 0, medium: 1, high: 2 };
      list.sort((a, b) => order[a.crowdLevel] - order[b.crowdLevel]);
    } else if (sort === 'temperature') {
      // 실제 날씨 데이터 기온 기준 정렬
      list.sort((a, b) => {
        const tempA = weatherMap[a.id]?.temperature ?? 0;
        const tempB = weatherMap[b.id]?.temperature ?? 0;
        return tempB - tempA;
      });
    } else {
      list.sort((a, b) => a.name.localeCompare(b.name, 'ko'));
    }
    return list;
  }, [region, sort, deferredQuery, weatherMap]);

  return (
    <div>
      <div className="sticky top-14 z-40 bg-background/90 backdrop-blur py-3 mb-6
                      border-b border-primary/10 -mx-4 px-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/30" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="해수욕장 이름 검색"
              className="w-full pl-8 pr-4 py-2 rounded-full border border-primary/20
                         bg-white text-sm text-navy placeholder:text-navy/30
                         focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="relative">
            <SlidersHorizontal size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/40 pointer-events-none" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="pl-8 pr-4 py-2 rounded-full border border-primary/20
                         bg-white text-sm text-navy appearance-none cursor-pointer
                         focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
        <p className="text-xs text-navy/40 mt-2">총 {filtered.length}개 해수욕장</p>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-navy/30">
          <span className="text-5xl">🥲</span>
          <p className="font-medium">해수욕장을 찾을 수 없어요</p>
          <p className="text-sm">다른 검색어나 지역을 선택해보세요</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((beach) => (
            <BeachCard
              key={beach.id}
              beach={beach}
              weather={weatherMap[beach.id]}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ListPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20 text-navy/30">불러오는 중...</div>}>
      <ListContent />
    </Suspense>
  );
}
