// src/components/shared/RecommendationBadge.tsx
import { RecommendationLevel } from '@/lib/types';
import { cn } from '@/lib/utils/cn';
import { Info } from 'lucide-react';

const explanations: Record<RecommendationLevel, string> = {
  Guaranteed: 'Your rank is significantly better than the previous closing rank. Admission is highly likely if trends remain similar.',
  Safe: 'Your rank is comfortably within the previous closing rank range. You have a strong chance of getting admission.',
  Reach: 'Your rank is worse than the previous closing rank. Admission is unlikely but still an aspirational option.',
  Dream: 'Your rank is slightly worse than the previous closing rank. Admission is possible if cutoffs increase this year.',
  'Not Eligible': 'You are not eligible based on the previous cutoff data.',
};

interface Props {
  level: RecommendationLevel;
  className?: string;
}

const styles: Record<RecommendationLevel, string> = {
  Guaranteed: 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200',
  Safe:       'bg-blue-100 text-blue-800 ring-1 ring-blue-200',
  Reach:      'bg-amber-100 text-amber-800 ring-1 ring-amber-200',
  Dream:      'bg-rose-100 text-rose-800 ring-1 ring-rose-200',
  'Not Eligible': 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
};

const icons: Record<RecommendationLevel, string> = {
  Guaranteed:     '✦',
  Safe:           '◉',
  Reach:          '◎',
  Dream:          '◌',
  'Not Eligible': '✕',
};

export function RecommendationBadge({ level, className }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold',
        styles[level],
        className
      )}
    >
      <span>{icons[level]}</span>
      <span>{level}</span>
      <span title={explanations[level]} className="ml-1 opacity-80" aria-hidden>
        <Info className="w-3.5 h-3.5" />
      </span>
    </span>
  );
}
