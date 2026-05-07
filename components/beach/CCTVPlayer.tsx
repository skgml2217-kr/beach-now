'use client';

import { useState } from 'react';
import { clsx } from 'clsx';

interface Camera {
  label: string;
  url: string;
}

interface CCTVPlayerProps {
  beachName: string;
  cameras: Camera[];
}

export default function CCTVPlayer({ beachName, cameras }: CCTVPlayerProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const hasCamera = cameras.length > 0 && cameras[0].url;

  if (!hasCamera) {
    return (
      <div
        className="bg-gradient-to-br from-primary/20 to-secondary/20
                      rounded-2xl aspect-video flex flex-col items-center
                      justify-center gap-3 border border-primary/10"
      >
        <span className="text-6xl">🌊</span>
        <p className="text-navy/40 text-sm">현재 영상을 불러올 수 없습니다</p>
        <p className="text-navy/30 text-xs">
          지자체 CCTV 연동 후 이용 가능합니다
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* 카메라 탭 (복수일 때만 표시) */}
      {cameras.length > 1 && (
        <div className="flex gap-2 mb-3">
          {cameras.map((cam, i) => (
            <button
              key={i}
              onClick={() => {
                setActiveIdx(i);
                setError(false);
                setLoading(true);
              }}
              className={clsx(
                'px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
                activeIdx === i
                  ? 'bg-primary text-white'
                  : 'bg-white text-navy/60 hover:bg-primary/10'
              )}
            >
              📷 {cam.label}
            </button>
          ))}
        </div>
      )}

      {/* 영상 플레이어 */}
      <div className="relative rounded-2xl overflow-hidden aspect-video bg-navy/5">
        {/* 로딩 스피너 */}
        {loading && !error && (
          <div
            className="absolute inset-0 flex items-center justify-center z-10
                          bg-gradient-to-br from-primary/10 to-secondary/10"
          >
            <div className="flex flex-col items-center gap-3">
              <div
                className="w-10 h-10 rounded-full border-4
                              border-primary/20 border-t-primary animate-spin"
              />
              <p className="text-xs text-navy/40">영상 불러오는 중...</p>
            </div>
          </div>
        )}

        {/* 에러 화면 */}
        {error && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center
                          gap-3 bg-gradient-to-br from-primary/10 to-secondary/10 z-10"
          >
            <span className="text-5xl">🌊</span>
            <p className="text-navy/40 text-sm">영상을 불러올 수 없습니다</p>
            <button
              onClick={() => {
                setError(false);
                setLoading(true);
              }}
              className="text-xs text-primary hover:underline"
            >
              다시 시도
            </button>
          </div>
        )}

        {/* iframe */}
        {!error && (
          <iframe
            key={activeIdx}
            src={cameras[activeIdx].url}
            title={`${beachName} CCTV ${cameras[activeIdx].label}`}
            className="w-full h-full border-0"
            allowFullScreen
            onLoad={() => setLoading(false)}
            onError={() => {
              setError(true);
              setLoading(false);
            }}
          />
        )}
      </div>
    </div>
  );
}
