import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { pool } from '../src/lib/db';

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error('ADMIN_EMAIL et ADMIN_PASSWORD doivent etre definis dans .env');
    process.exit(1);
  }

  const hash = await bcrypt.hash(password, 12);

  await pool.query(
    `INSERT INTO users (email, password_hash, name)
     VALUES ($1, $2, 'Admin')
     ON CONFLICT (email) DO UPDATE SET password_hash = $2`,
    [email, hash]
  );

  console.log(`Compte admin pret : ${email}`);
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
