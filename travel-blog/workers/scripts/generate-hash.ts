/**
 * Script to generate bcrypt password hashes for user credentials
 * Usage: npx ts-node scripts/generate-hash.ts <password>
 */

import bcrypt from 'bcryptjs';

const password = process.argv[2];

if (!password) {
  console.error('Usage: npx ts-node scripts/generate-hash.ts <password>');
  console.error('Example: npx ts-node scripts/generate-hash.ts mySecurePassword123');
  process.exit(1);
}

// Cost factor 10 per research decision
const COST_FACTOR = 10;

console.log(`\nGenerating bcrypt hash (cost factor ${COST_FACTOR})...`);
const hash = bcrypt.hashSync(password, COST_FACTOR);

console.log('\nPassword hash:');
console.log(hash);
console.log('\nCopy this hash to workers/users.json');
console.log('⚠️  Never commit plaintext passwords!\n');
