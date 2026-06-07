// src/app/api/predict/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { validatePredictRequest } from '@/lib/validations';
import { getRecommendation, sortPredictions, expandBranchGroups } from '@/lib/utils/prediction';
import { PredictionResult } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data, errors } = validatePredictRequest(body);

    if (errors || !data) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    const { rank, category, branches = [], branchGroups = [], city = [], district = [], college_type = [], autonomous } = data;

    // Expand branch groups into individual branch names
    const allBranches = expandBranchGroups(branches, branchGroups);

    // Build cutoff query — always filter by the selected category only
    const cutoffWhere: Record<string, unknown> = {
      category: category,
      counselling_year: 2025,
      counselling_round: 3,
    };

    if (allBranches.length > 0) {
      cutoffWhere.branch_name = { in: allBranches };
    }

    // Build metadata filter
    const metadataWhere: Record<string, unknown> = {};
    if (city.length > 0) metadataWhere.city = { in: city };
    if (district.length > 0) metadataWhere.district = { in: district };
    if (college_type.length > 0) metadataWhere.college_type = { in: college_type };
    if (autonomous !== null) metadataWhere.autonomous = autonomous;

    // If metadata filters are set, get matching college codes first
    let allowedCollegeCodes: string[] | null = null;
    if (Object.keys(metadataWhere).length > 0) {
      const matchingColleges = await prisma.collegeMetadata.findMany({
        where: metadataWhere,
        select: { college_code: true },
      });
      allowedCollegeCodes = matchingColleges.map((c) => c.college_code);
      if (allowedCollegeCodes.length === 0) {
        return NextResponse.json({ success: true, count: 0, results: [] });
      }
      cutoffWhere.college_code = { in: allowedCollegeCodes };
    }

    // Fetch cutoffs
    const cutoffs = await prisma.cutoff.findMany({
      where: cutoffWhere,
      include: {
        college: {
          include: { metadata: true },
        },
      },
    });

    // Apply prediction logic and filter Not Eligible
    const results: PredictionResult[] = [];

    for (const cutoff of cutoffs) {
      const cutoffRank = Number(cutoff.cutoff_rank);
      const recommendation = getRecommendation(rank, cutoffRank);

      // Exclude Not Eligible by default
      if (recommendation === 'Not Eligible') continue;

      results.push({
        college_code: cutoff.college_code,
        college_name: cutoff.college_name,
        branch_name: cutoff.branch_name,
        category: cutoff.category,
        cutoff_rank: cutoffRank,
        student_rank: rank,
        recommendation,
        city: cutoff.college.metadata?.city ?? null,
        district: cutoff.college.metadata?.district ?? null,
        college_type: cutoff.college.metadata?.college_type ?? null,
        autonomous: cutoff.college.metadata?.autonomous ?? null,
      });
    }

    const sorted = sortPredictions(results);

    return NextResponse.json({
      success: true,
      count: sorted.length,
      results: sorted,
    });
  } catch (error) {
    console.error('[/api/predict]', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
