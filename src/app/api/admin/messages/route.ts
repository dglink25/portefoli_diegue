import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAdmin } from '@/lib/require-admin';

export async function GET() {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  const messages = await query(
    'SELECT * FROM messages ORDER BY created_at DESC'
  );
  return NextResponse.json(messages);
}
