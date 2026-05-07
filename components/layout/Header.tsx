'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { REGIONS, REGION_META } from '@/lib/constants';
import type { Region } from '@/lib/types';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState('');
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  /* 현재 시각 업데이트 */
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
      );
      setDateStr(
        now.toLocaleDateString('ko-KR', {
          month: 'long',
          day: 'numeric',
          weekday: 'short',
        })
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  /* 현재 선택된 지역 */
  const activeRegion = (searchParams.get('region') ?? 'all') as Region;

  /* 지역 탭 클릭 */
  const handleRegion = (r: Region) => {
    const params = new URLSearchParams(searchParams.toString());
    if (r === 'all') params.delete('region');
    else params.set('region', r);
    router.push(`/list?${params.toString()}`);
  };

  /* 검색 제출 */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/list?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-primary/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        {/* ── 상단 행: 로고 + 검색 + 시각 ── */}
        <div className="flex items-center justify-between gap-4 h-14">
          {/* 로고 */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl">🌊</span>
            <span className="font-bold text-navy text-lg tracking-tight">
              바다지금
            </span>
          </Link>

          {/* 검색창 */}
          <form onSubmit={handleSearch} className="flex-1 max-w-sm relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="해수욕장 이름으로 검색"
              className="w-full pl-4 pr-10 py-1.5 rounded-full border border-primary/30
                         bg-background text-navy text-sm placeholder:text-navy/40
                         focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-primary"
              aria-label="검색"
            >
              <Search size={16} />
            </button>
          </form>

          {/* 날짜·시각 */}
          <div className="hidden sm:flex flex-col items-end shrink-0 text-right">
            <span className="text-xs text-navy/50">{dateStr}</span>
            <span className="text-sm font-medium text-navy">{timeStr}</span>
          </div>
        </div>

        {/* ── 하단 행: 지역 탭 ── */}
        <nav
          className="flex gap-1 pb-1 overflow-x-auto no-scrollbar"
          aria-label="지역 필터"
        >
          {REGIONS.map((r) => {
            const meta = REGION_META[r];
            const isActive = pathname.startsWith('/list') && activeRegion === r;
            return (
              <button
                key={r}
                onClick={() => handleRegion(r)}
                className={clsx(
                  'flex items-center gap-1 px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors',
                  isActive
                    ? 'bg-primary text-white font-medium'
                    : 'text-navy/60 hover:text-navy hover:bg-primary/10'
                )}
              >
                <span>{meta.emoji}</span>
                <span>{meta.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
