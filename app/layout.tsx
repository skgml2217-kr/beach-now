import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Providers from './providers';
import BottomNav from '@/components/layout/BottomNav';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: '바다지금 — 전국 해수욕장 실시간 현황',
  description:
    '전국 해수욕장의 실시간 CCTV 영상과 기상 현황을 한눈에 확인하세요.',
  openGraph: {
    title: '바다지금 — 전국 해수욕장 실시간 현황',
    description: '지금 바다는 어때요? 실시간으로 확인하세요.',
    locale: 'ko_KR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen flex flex-col bg-background text-navy antialiased">
        <Providers>
          <Suspense
            fallback={
              <div className="h-14 bg-white/80 border-b border-primary/20" />
            }
          >
            <Header />
          </Suspense>

          <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
            {children}
          </main>

          <Footer />
          <Suspense fallback={null}>
            <BottomNav />
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
