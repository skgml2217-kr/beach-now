import { clsx } from 'clsx';
import type { CrowdLevel } from '@/lib/types';

/* ── 혼잡도 배지 ── */
const CROWD_STYLE: Record<CrowdLevel, string> = {
  low: 'bg-secondary/30 text-teal-700',
  medium: 'bg-yellow-100   text-yellow-700',
  high: 'bg-accent/20    text-red-600 animate-pulse2',
};
const CROWD_EMOJI: Record<CrowdLevel, string> = {
  low: '🟢',
  medium: '🟡',
  high: '🔴',
};
const CROWD_LABEL: Record<CrowdLevel, string> = {
  low: '여유',
  medium: '보통',
  high: '혼잡',
};

export function CrowdBadge({ level }: { level: CrowdLevel }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium',
        CROWD_STYLE[level]
      )}
      aria-label={`혼잡도: ${CROWD_LABEL[level]}`}
    >
      {CROWD_EMOJI[level]} {CROWD_LABEL[level]}
    </span>
  );
}

/* ── 일반 배지 ── */
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost';
  className?: string;
}

export function Badge({
  children,
  variant = 'primary',
  className,
}: BadgeProps) {
  const styles = {
    primary: 'bg-primary/15 text-primary',
    secondary: 'bg-secondary/20 text-teal-700',
    accent: 'bg-accent/15 text-orange-600',
    ghost: 'bg-navy/5 text-navy/60',
  };
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        styles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
