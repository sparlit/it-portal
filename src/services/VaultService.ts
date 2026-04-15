import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16;

export class VaultService {
  private static getMasterKey(): Buffer {
    const key = process.env.VAULT_MASTER_KEY;
    if (!key && process.env.NODE_ENV === 'production') {
      throw new Error('CRITICAL: VAULT_MASTER_KEY is missing in production.');
    }
    // Fallback for build/dev
    const secret = key || '32-character-secret-key-for-vault';
    return Buffer.from(secret.padEnd(32, '0').slice(0, 32));
  }

  static encrypt(text: string): string {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, this.getMasterKey(), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  }

  static decrypt(text: string): string {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift()!, 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, this.getMasterKey(), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }
}
