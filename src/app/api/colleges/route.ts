// src/app/api/colleges/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') ?? '';
    const city = searchParams.get('city');
    const district = searchParams.get('district');
    const college_type = searchParams.get('college_type');
    const autonomous = searchParams.get('autonomous');
    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100);
    const skip = (page - 1) * limit;

    const metadataWhere: Record<string, unknown> = {};
    if (city) metadataWhere.city = city;
    if (district) metadataWhere.district = district;
    if (college_type) metadataWhere.college_type = college_type;
    if (autonomous === 'true') metadataWhere.autonomous = true;
    if (autonomous === 'false') metadataWhere.autonomous = false;

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { college_name: { contains: search, mode: 'insensitive' } },
        { college_code: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (Object.keys(metadataWhere).length > 0) {
      where.metadata = { is: metadataWhere };
    }

    const [colleges, total] = await Promise.all([
      prisma.college.findMany({
        where,
        include: { metadata: true },
        orderBy: { college_name: 'asc' },
        skip,
        take: limit,
      }),
      prisma.college.count({ where }),
    ]);

    const data = colleges.map((c) => ({
      college_code: c.college_code,
      college_name: c.college_name,
      city: c.metadata?.city ?? null,
      district: c.metadata?.district ?? null,
      college_type: c.metadata?.college_type ?? null,
      autonomous: c.metadata?.autonomous ?? null,
      naac_grade: c.metadata?.naac_grade ?? null,
    }));

    return NextResponse.json({
      success: true,
      count: total,
      page,
      limit,
      data,
    });
  } catch (error) {
    console.error('[/api/colleges]', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
