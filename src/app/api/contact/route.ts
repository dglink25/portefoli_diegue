import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { messageSchema } from '@/lib/validators';

export const runtime = 'nodejs';

/* ─────────────────────────────────────────────────────────
   Envoi email via nodemailer (activé si SMTP_PASS configuré)
   Pour utiliser : installer nodemailer dans le container
   puis décommenter le bloc ci-dessous.
───────────────────────────────────────────────────────── */
async function sendEmail(full_name: string, email: string, subject: string | null, message: string) {
  const pass = process.env.SMTP_PASS;
  if (!pass || pass === 'your_app_password_here') return; // SMTP non configuré

  try {
    // Chargement dynamique pour éviter les erreurs si le module est absent
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      host:   process.env.SMTP_HOST   || 'smtp.gmail.com',
      port:   Number(process.env.SMTP_PORT ?? 465),
      secure: Number(process.env.SMTP_PORT ?? 465) === 465,
      auth:   { user: process.env.SMTP_USER, pass },
    });

    const to   = process.env.CONTACT_TO ?? process.env.SMTP_USER;
    const subj = subject ? `[Portfolio] ${subject}` : `[Portfolio] Message de ${full_name}`;

    const html = `
      <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;padding:24px">
        <div style="background:#0550ae;border-radius:12px 12px 0 0;padding:20px 24px">
          <h1 style="color:#fff;margin:0;font-size:18px;font-weight:700">Nouveau message - Portfolio</h1>
        </div>
        <div style="background:#f6f8fa;border:1px solid #d0d7de;border-top:none;border-radius:0 0 12px 12px;padding:24px">
          <p><strong>De :</strong> ${full_name} &lt;<a href="mailto:${email}">${email}</a>&gt;</p>
          ${subject ? `<p><strong>Sujet :</strong> ${subject}</p>` : ''}
          <hr style="border:none;border-top:1px solid #d0d7de;margin:16px 0"/>
          <p style="white-space:pre-wrap;line-height:1.65">${message}</p>
          <hr style="border:none;border-top:1px solid #d0d7de;margin:16px 0"/>
          <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject ?? `Message de ${full_name}`)}"
             style="display:inline-block;background:#0550ae;color:#fff;font-size:14px;font-weight:600;padding:10px 20px;border-radius:8px;text-decoration:none">
            Répondre à ${full_name}
          </a>
        </div>
      </div>`;

    await transporter.sendMail({
      from:    `"Portfolio Contact" <${process.env.SMTP_USER}>`,
      to, replyTo: `"${full_name}" <${email}>`,
      subject: subj, html,
      text: `De: ${full_name} <${email}>\n\n${message}`,
    });
  } catch (err) {
    console.error('[contact] SMTP error:', err);
  }
}

export async function POST(req: Request) {
  const body   = await req.json().catch(() => null);
  const parsed = messageSchema.safeParse(body);

  if (!parsed.success)
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });

  const { full_name, email, subject, message } = parsed.data;

  /* 1. Sauvegarde en DB (toujours) */
  await query(
    'INSERT INTO messages (full_name, email, subject, message) VALUES ($1, $2, $3, $4)',
    [full_name, email, subject ?? null, message]
  );

  /* 2. Envoi email (si nodemailer installé et SMTP configuré) */
  await sendEmail(full_name, email, subject ?? null, message);

  return NextResponse.json({ ok: true }, { status: 201 });
}
