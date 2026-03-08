import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const ADMIN_USERNAME = 'admin123';
const ADMIN_PASSWORD = 'admin123';
const SALT_ROUNDS = 10;

export const seedAdmin = async () => {
  const existingAdmin = await User.findOne({ username: ADMIN_USERNAME });
  if (existingAdmin) {
    return;
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);
  await User.create({
    username: ADMIN_USERNAME,
    email: `${ADMIN_USERNAME}@admin.local`,
    passwordHash,
    role: 'admin',
  });

  console.log(`Seeded admin account: username=${ADMIN_USERNAME}`);
};
