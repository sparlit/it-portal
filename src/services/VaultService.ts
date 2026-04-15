import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = process.env.VAULT_MASTER_KEY;

// In Next.js build, NODE_ENV might be 'production' even if we're just building.
// We only want to throw if we're actually running in a real production environment.
// For build time, we can allow the fallback.

// 32-byte key
if (!ENCRYPTION_KEY) {
  throw new Error('CRITICAL: VAULT_MASTER_KEY environment variable is missing.');
}
const MASTER_KEY = Buffer.from(ENCRYPTION_KEY, 'utf8').slice(0, 32);
const IV_LENGTH = 16;

export class VaultService {
  static encrypt(text: string): string {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, MASTER_KEY, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  }

  static decrypt(text: string): string {
    try {
      const textParts = text.split(':');
      const iv = Buffer.from(textParts.shift()!, 'hex');
      const encryptedText = Buffer.from(textParts.join(':'), 'hex');
      const decipher = crypto.createDecipheriv(ALGORITHM, MASTER_KEY, iv);
      let decrypted = decipher.update(encryptedText);
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      return decrypted.toString();
    } catch (e) {
      console.error('Vault Decryption Error:', e);
      return 'DECRYPTION_FAILED';
    }
  }
}
