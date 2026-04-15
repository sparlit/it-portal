import { prisma } from '../src/lib/db';
import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = Buffer.from('4a534c61625f496e647573747269616c5f5365637265745f4b65795f32303234', 'hex');
const IV_LENGTH = 16;

function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text: string): string {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift()!, 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

async function verifyEncryption() {
  console.log('--- Verifying Vault Encryption Logic (End-to-End) ---');
  const tenant = await prisma.tenant.findFirst();
  const tenantId = tenant!.id;
  const rawPassword = 'SuperSecretPassword@123';
  const systemName = `EncryptedSystem_${Date.now()}`;

  console.log(`Adding credential via simulated Service logic for ${systemName}...`);
  const encryptedPassword = encrypt(rawPassword);

  const credential = await prisma.credential.create({
    data: {
      tenantId,
      system: systemName,
      username: 'vault_user',
      password: encryptedPassword
    }
  });

  console.log(`Stored in DB: ${credential.password}`);

  if (!credential.password?.includes(':')) {
    throw new Error('Encryption failed: Missing IV separator');
  }

  const decrypted = decrypt(credential.password);
  console.log(`Decrypted: ${decrypted}`);

  if (decrypted === rawPassword) {
    console.log('SUCCESS: Encryption and Decryption verified.');
  } else {
    throw new Error('Decryption mismatch!');
  }
}

verifyEncryption().catch(console.error);
