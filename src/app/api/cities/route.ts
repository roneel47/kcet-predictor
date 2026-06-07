// src/app/api/cities/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
  try {
    const cities = await prisma.collegeMetadata.findMany({
      select: { city: true },
      distinct: ['city'],
      where: { city: { not: null } },
      orderBy: { city: 'asc' },
    });

    return NextResponse.json({
      success: true,
      data: cities.map((c) => c.city).filter(Boolean),
    });
  } catch (error) {
    console.error('[/api/cities]', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
