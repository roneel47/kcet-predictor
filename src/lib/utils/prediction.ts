// src/lib/utils/prediction.ts
// Implements prediction logic exactly as defined in prediction_logic.md
// DO NOT modify thresholds or business rules.

import { RecommendationLevel, RECOMMENDATION_ORDER } from '@/lib/types';

/**
 * Determine recommendation level based on student rank vs cutoff rank.
 * Thresholds are frozen per prediction_logic.md.
 */
export function getRecommendation(
  studentRank: number,
  cutoffRank: number
): RecommendationLevel {
  if (studentRank <= cutoffRank * 0.80) return 'Guaranteed';
  if (studentRank <= cutoffRank * 0.95) return 'Safe';
  if (studentRank <= cutoffRank * 1.10) return 'Reach';
  if (studentRank <= cutoffRank * 1.50) return 'Dream';
  return 'Not Eligible';
}

/**
 * Sort prediction results per spec:
 * 1. Guaranteed → Safe → Reach → Dream
 * 2. Then by cutoff_rank ascending
 * 3. Then by college_name alphabetically
 */
export function sortPredictions<
  T extends { recommendation: RecommendationLevel; cutoff_rank: number; college_name: string }
>(results: T[]): T[] {
  return [...results].sort((a, b) => {
    const orderA = RECOMMENDATION_ORDER.indexOf(a.recommendation);
    const orderB = RECOMMENDATION_ORDER.indexOf(b.recommendation);
    if (orderA !== orderB) return orderA - orderB;
    if (a.cutoff_rank !== b.cutoff_rank) return a.cutoff_rank - b.cutoff_rank;
    return a.college_name.localeCompare(b.college_name);
  });
}

/**
 * Expand branch group names to individual branch names.
 */
import { BRANCH_GROUPS } from '@/lib/types';

export function expandBranchGroups(
  branches: string[],
  branchGroups: string[]
): string[] {
  const expanded = new Set<string>(branches);
  for (const group of branchGroups) {
    const groupBranches = BRANCH_GROUPS[group];
    if (groupBranches) {
      groupBranches.forEach((b) => expanded.add(b));
    }
  }
  return Array.from(expanded);
}
