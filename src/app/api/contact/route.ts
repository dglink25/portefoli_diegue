import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { messageSchema } from '@/lib/validators';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = messageSchema.safeParse(body);

  if (!parsed.success)
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });

  const { full_name, email, subject, message } = parsed.data;

  /* ── 1. Sauvegarde en DB (toujours) ── */
  await query(
    'INSERT INTO messages (full_name, email, subject, message) VALUES ($1, $2, $3, $4)',
    [full_name, email, subject ?? null, message]
  );

  /* ── 2. Envoi email via SMTP (optionnel, si configuré) ── */
  const smtpPass = process.env.SMTP_PASS;
  const smtpUser = process.env.SMTP_USER;
  const smtpHost = process.env.SMTP_HOST;

  if (smtpHost && smtpUser && smtpPass && smtpPass !== 'your_app_password_here') {
    try {
      /* Import dynamique pour éviter l'erreur si nodemailer absent */
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const nm = require('nodemailer');
      const transporter = nm.createTransport({
        host: smtpHost,
        port: Number(process.env.SMTP_PORT ?? 465),
        secure: Number(process.env.SMTP_PORT ?? 465) === 465,
        auth: { user: smtpUser, pass: smtpPass },
      });

      const to   = process.env.CONTACT_TO ?? smtpUser;
      const subj = subject ? `[Portfolio] ${subject}` : `[Portfolio] Message de ${full_name}`;
      const html = `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px">
          <div style="background:#0550ae;border-radius:12px 12px 0 0;padding:20px 24px">
            <h1 style="color:#fff;margin:0;font-size:18px">Nouveau message — Portfolio</h1>
          </div>
          <div style="background:#f6f8fa;border:1px solid #d0d7de;border-top:none;border-radius:0 0 12px 12px;padding:24px">
            <p><strong>De :</strong> ${full_name} &lt;${email}&gt;</p>
            ${subject ? `<p><strong>Sujet :</strong> ${subject}</p>` : ''}
            <p><strong>Message :</strong></p>
            <p style="white-space:pre-wrap;color:#1c2128">${message}</p>
            <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject ?? `Message de ${full_name}`)}"
               style="display:inline-block;background:#0550ae;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;margin-top:16px">
              Répondre à ${full_name}
            </a>
          </div>
        </div>`;

      await transporter.sendMail({
        from: `"Portfolio Contact" <${smtpUser}>`,
        to, replyTo: `"${full_name}" <${email}>`,
        subject: subj, html,
        text: `De: ${full_name} <${email}>\n\n${message}`,
      });
    } catch (err) {
      /* Ne pas faire échouer la requête si SMTP indisponible */
      console.error('[contact] SMTP error (non-fatal):', (err as Error).message);
    }
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
