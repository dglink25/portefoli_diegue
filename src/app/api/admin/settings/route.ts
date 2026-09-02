import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAdmin } from '@/lib/require-admin';

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const settings = await query('SELECT * FROM settings');
  return NextResponse.json({ settings });
}

export async function PUT(req: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const body = await req.json().catch(() => null);
  if (!body?.key || body.value === undefined) {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });
  }

  const [setting] = await query(
    `INSERT INTO settings (key, value) VALUES ($1, $2)
     ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = now()
     RETURNING *`,
    [body.key, JSON.stringify(body.value)]
  );
  return NextResponse.json({ setting });
}
