// src/app/api/branches/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
  try {
    const branches = await prisma.cutoff.findMany({
      select: { branch_name: true },
      distinct: ['branch_name'],
      orderBy: { branch_name: 'asc' },
    });

    return NextResponse.json({
      success: true,
      data: branches.map((b) => b.branch_name),
    });
  } catch (error) {
    console.error('[/api/branches]', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
