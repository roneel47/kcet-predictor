// src/app/api/categories/route.ts
import { NextResponse } from 'next/server';
import { ALL_CATEGORIES } from '@/lib/types';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: ALL_CATEGORIES,
  });
}
