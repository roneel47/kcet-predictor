// src/lib/utils/export.ts
import { PredictionResult } from '@/lib/types';

export function toCsv(results: PredictionResult[]): string {
  const headers = [
    'College Code',
    'College Name',
    'Branch',
    'Category',
    'Student Rank',
    'Cutoff Rank',
    'Recommendation',
    'City',
    'District',
    'College Type',
    'Autonomous',
  ];

  const rows = results.map((r) =>
    [
      r.college_code,
      `"${r.college_name.replace(/"/g, '""')}"`,
      `"${r.branch_name.replace(/"/g, '""')}"`,
      r.category,
      r.student_rank,
      r.cutoff_rank,
      r.recommendation,
      r.city ?? '',
      r.district ?? '',
      r.college_type ?? '',
      r.autonomous === true ? 'Yes' : r.autonomous === false ? 'No' : '',
    ].join(',')
  );

  return [headers.join(','), ...rows].join('\n');
}
