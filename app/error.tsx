'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5 text-center">
      <span className="text-8xl">🦀</span>
      <div>
        <h1 className="text-2xl font-bold text-navy mb-2">
          파도가 너무 거세요
        </h1>
        <p className="text-navy/50 text-sm">
          일시적인 오류가 발생했어요. 잠시 후 다시 시도해주세요.
        </p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-6 py-2.5 rounded-full bg-primary text-white
                     text-sm font-medium hover:brightness-105 transition-all"
        >
          🔄 다시 시도
        </button>
        <Link
          href="/"
          className="px-6 py-2.5 rounded-full bg-white text-navy border border-primary/20
                     text-sm font-medium hover:bg-background transition-all"
        >
          🌊 홈으로
        </Link>
      </div>
    </div>
  );
}
