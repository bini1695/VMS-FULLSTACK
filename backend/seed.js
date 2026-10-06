import 'dotenv/config';
import bcrypt from 'bcryptjs';
import db from './config/database.js';

const demoUsers = [
  { full_name: 'System Admin',     email: 'admin@vetcare.com',     password: 'admin123',     role: 'System administrator' },
  { full_name: 'Dr. Amara Mensah', email: 'vet@vetcare.com',       password: 'vet123',       role: 'Veterinarian' },
  { full_name: 'Nora Okafor',      email: 'lab@vetcare.com',       password: 'lab123',       role: 'Lab technician' },
  { full_name: 'Jae Lin',          email: 'reception@vetcare.com', password: 'reception123', role: 'Receptionist' },
  { full_name: 'Marcus Chen',      email: 'pharmacy@vetcare.com',  password: 'pharmacy123',  role: 'Pharmacist' },
  { full_name: 'Taylor Davis',     email: 'owner@vetcare.com',     password: 'owner123',     role: 'Pet owner' },
];

async function seed() {
  console.log('\n🌱 Seeding demo users...\n');

  const [branches] = await db.query(
    'SELECT branch_id FROM clinic_branches ORDER BY branch_id LIMIT 1'
  );
  const branchId = branches.length ? branches[0].branch_id : null;

  if (!branchId) {
    console.error('❌ No branch exists. Run the branch INSERT first.');
    process.exit(1);
  }
  console.log(`✅ Using branch_id = ${branchId}\n`);

  for (const u of demoUsers) {
    const hash = await bcrypt.hash(u.password, 10);
    try {
      await db.query(
        `INSERT INTO users (full_name, email, password_hash, role, status, branch_id)
         VALUES (?, ?, ?, ?, 'Active', ?)
         ON DUPLICATE KEY UPDATE
           password_hash = VALUES(password_hash),
           full_name     = VALUES(full_name),
           role          = VALUES(role),
           status        = VALUES(status),
           branch_id     = VALUES(branch_id)`,
        [u.full_name, u.email, hash, u.role, branchId]
      );
      console.log(`✅ ${u.email.padEnd(28)} → ${u.password.padEnd(15)} [${u.role}]`);
    } catch (err) {
      console.error(`❌ ${u.email}: ${err.message}`);
    }
  }

  console.log('\n🌱 Done.\n');
  process.exit(0);
}

seed();