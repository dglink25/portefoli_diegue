import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAdmin } from '@/lib/require-admin';

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const reviews = await query('SELECT * FROM reviews ORDER BY created_at DESC');
  return NextResponse.json({ reviews });
}
