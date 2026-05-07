import type { CrowdLevel } from '../types';

/* ── 성수기 기간 ── */
const PEAK_START = { month: 7, day: 15 };
const PEAK_END = { month: 8, day: 15 };

function isPeakSeason(date: Date): boolean {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  if (m === PEAK_START.month && d >= PEAK_START.day) return true;
  if (m === PEAK_END.month && d <= PEAK_END.day) return true;
  return false;
}

/* ── 혼잡도 점수 계산 (0~10) ── */
export function calculateCrowdLevel(
  beachId: string,
  date = new Date()
): CrowdLevel {
  let score = 0;

  // 요일 가중치 (0=일, 6=토)
  const dow = date.getDay();
  if (dow === 0 || dow === 6) score += 3; // 주말
  else if (dow === 5) score += 2; // 금요일
  else score += 0; // 평일

  // 시간대 가중치
  const hour = date.getHours();
  if (hour >= 13 && hour <= 16) score += 4; // 오후 1~4시 피크
  else if (hour >= 10 && hour <= 12) score += 2; // 오전
  else if (hour >= 17 && hour <= 19) score += 2; // 저녁
  else score += 0; // 이른 아침/밤

  // 성수기 가중치
  if (isPeakSeason(date)) score += 3;

  // 해수욕장별 기본 인기도 (id 길이로 분산)
  const basePopularity = beachId.length % 3;
  score += basePopularity;

  if (score >= 8) return 'high';
  if (score >= 4) return 'medium';
  return 'low';
}

/* ── 혼잡도 색상 클래스 ── */
export function getCrowdColor(level: CrowdLevel): string {
  return {
    low: 'bg-secondary/20 text-teal-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-accent/20 text-red-600',
  }[level];
}

/* ── 혼잡도 안내 문구 ── */
export function getCrowdMessage(level: CrowdLevel): string {
  return {
    low: '지금 한산해요. 방문하기 좋은 시간이에요! 🟢',
    medium: '적당히 붐비고 있어요. 🟡',
    high: '현재 매우 혼잡합니다. 방문에 참고하세요. 🔴',
  }[level];
}
