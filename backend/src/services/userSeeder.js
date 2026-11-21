import bcrypt from 'bcryptjs';
import { DEMO_USERS } from '../config/constants.js';

/** Creates the demo users if they do not already exist. Safe to run on every startup. */
export async function seedDemoUsers({ userRepository, seedPassword, saltRounds }) {
  const passwordHash = await bcrypt.hash(seedPassword, saltRounds);

  for (const demoUser of DEMO_USERS) {
    if (userRepository.findByEmail(demoUser.email) === null) {
      userRepository.create({ ...demoUser, passwordHash });
    }
  }
}
