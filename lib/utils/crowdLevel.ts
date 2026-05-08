import type { CrowdLevel } from '../types'

/* ── 시즌 구분 ── */
const PEAK_SEASON   = { startMonth: 7, startDay: 15, endMonth: 8, endDay: 15 }
const OPEN_SEASON   = { startMonth: 6, startDay: 20, endMonth: 9, endDay: 10 }

function getSeasonType(date: Date): 'peak' | 'open' | 'off' {
  const m = date.getMonth() + 1
  const d = date.getDate()

  // 성수기: 7/15 ~ 8/15
  if (
    (m === PEAK_SEASON.startMonth && d >= PEAK_SEASON.startDay) ||
    (m === PEAK_SEASON.endMonth   && d <= PEAK_SEASON.endDay) ||
    (m > PEAK_SEASON.startMonth && m < PEAK_SEASON.endMonth)
  ) return 'peak'

  // 개장기간: 6/20 ~ 9/10
  if (
    (m === OPEN_SEASON.startMonth && d >= OPEN_SEASON.startDay) ||
    (m === OPEN_SEASON.endMonth   && d <= OPEN_SEASON.endDay) ||
    (m > OPEN_SEASON.startMonth && m < OPEN_SEASON.endMonth)
  ) return 'open'

  // 비수기
  return 'off'
}

/* ── 혼잡도 점수 계산 ── */
export function calculateCrowdLevel(beachId: string, date = new Date()): CrowdLevel {
  const season = getSeasonType(date)

  // 비수기(개장 전/후)에는 무조건 여유
  if (season === 'off') return 'low'

  let score = 0

  // 요일 가중치
  const dow = date.getDay()
  if (dow === 0 || dow === 6) score += 3  // 주말
  else if (dow === 5)          score += 2  // 금요일
  else                         score += 0  // 평일

  // 시간대 가중치
  const hour = date.getHours()
  if (hour >= 13 && hour <= 16)      score += 3  // 오후 피크
  else if (hour >= 10 && hour <= 12) score += 2  // 오전
  else if (hour >= 17 && hour <= 19) score += 1  // 저녁
  else                                score += 0  // 이른 아침/밤

  // 성수기 추가 가중치
  if (season === 'peak') score += 3

  // 해수욕장 기본 인기도
  score += beachId.length % 3

  // 개장기간(비성수기)엔 점수 상한을 낮춤
  if (season === 'open') {
    if (score >= 7) return 'medium'
    if (score >= 4) return 'low'
    return 'low'
  }

  // 성수기
  if (score >= 8) return 'high'
  if (score >= 4) return 'medium'
  return 'low'
}

/* ── 혼잡도 색상 클래스 ── */
export function getCrowdColor(level: CrowdLevel): string {
  return {
    low:    'bg-secondary/20 text-teal-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high:   'bg-accent/20 text-red-600',
  }[level]
}

/* ── 혼잡도 안내 문구 ── */
export function getCrowdMessage(level: CrowdLevel): string {
  return {
    low:    '지금 한산해요. 방문하기 좋은 시간이에요! 🟢',
    medium: '적당히 붐비고 있어요. 🟡',
    high:   '현재 매우 혼잡합니다. 방문에 참고하세요. 🔴',
  }[level]
}
