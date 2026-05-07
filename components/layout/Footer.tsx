import { DATA_SOURCES } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-primary/15 bg-white/60">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col sm:flex-row gap-6 justify-between text-sm">
        {/* 브랜드 */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🌊</span>
            <span className="font-bold text-navy">바다지금</span>
          </div>
          <p className="text-navy/50 text-xs leading-relaxed">
            전국 해수욕장 실시간 현황 서비스
            <br />
            기상 데이터는 10분 간격으로 갱신됩니다.
          </p>
        </div>

        {/* 데이터 출처 */}
        <div>
          <p className="font-medium text-navy/70 mb-2">데이터 출처</p>
          <ul className="flex flex-col gap-1">
            {DATA_SOURCES.map((src) => (
              <li key={src.name}>
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-xs"
                >
                  {src.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* 링크 */}
        <div>
          <p className="font-medium text-navy/70 mb-2">안내</p>
          <ul className="flex flex-col gap-1 text-xs text-navy/50">
            <li>
              <a href="/privacy" className="hover:text-navy">
                개인정보처리방침
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-navy">
                문의하기
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-primary/10 text-center text-xs text-navy/30 py-3">
        © {new Date().getFullYear()} 바다지금. All rights reserved.
      </div>
    </footer>
  );
}
