import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { messageSchema } from '@/lib/validators';

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = messageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });
  }

  const { full_name, email, subject, message } = parsed.data;
  await query(
    'INSERT INTO messages (full_name, email, subject, message) VALUES ($1, $2, $3, $4)',
    [full_name, email, subject || null, message]
  );

  return NextResponse.json({ ok: true }, { status: 201 });
}
