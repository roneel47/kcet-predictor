// src/app/api/college/[college_code]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ college_code: string }> }
) {
  try {
    const { college_code } = await context.params;

    const college = await prisma.college.findUnique({
      where: { college_code: college_code.toUpperCase() },
      include: {
        metadata: true,
        cutoffs: {
          where: { counselling_year: 2025, counselling_round: 3 },
          orderBy: [{ branch_name: 'asc' }, { category: 'asc' }],
        },
      },
    });

    if (!college) {
      return NextResponse.json({ success: false, error: 'College not found' }, { status: 404 });
    }

    // Group cutoffs by branch
    const branchMap = new Map<string, { category: string; cutoff_rank: number }[]>();
    for (const cutoff of college.cutoffs) {
      if (!branchMap.has(cutoff.branch_name)) {
        branchMap.set(cutoff.branch_name, []);
      }
      branchMap.get(cutoff.branch_name)!.push({
        category: cutoff.category,
        cutoff_rank: Number(cutoff.cutoff_rank),
      });
    }

    const branches = Array.from(branchMap.entries()).map(([branch_name, cutoffs]) => ({
      branch_name,
      cutoffs,
    }));

    return NextResponse.json({
      success: true,
      data: {
        college_code: college.college_code,
        college_name: college.college_name,
        city: college.metadata?.city ?? null,
        district: college.metadata?.district ?? null,
        college_type: college.metadata?.college_type ?? null,
        autonomous: college.metadata?.autonomous ?? null,
        university: college.metadata?.university ?? null,
        naac_grade: college.metadata?.naac_grade ?? null,
        nirf_rank: college.metadata?.nirf_rank ? Number(college.metadata.nirf_rank) : null,
        website: college.metadata?.website ?? null,
        branches,
      },
    });
  } catch (error) {
    console.error('[/api/college/[college_code]]', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
