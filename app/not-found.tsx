import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5 text-center">
      <span className="text-8xl animate-bounce">⭐</span>
      <div>
        <h1 className="text-2xl font-bold text-navy mb-2">
          이 해수욕장은 없어요
        </h1>
        <p className="text-navy/50 text-sm">
          주소가 잘못됐거나 삭제된 페이지예요.
        </p>
      </div>
      <Link
        href="/"
        className="px-6 py-2.5 rounded-full bg-primary text-white
                   text-sm font-medium hover:brightness-105 transition-all"
      >
        🌊 홈으로 돌아가기
      </Link>
    </div>
  );
}
