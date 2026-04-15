import { prisma } from '@/lib/db';
import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = Buffer.from('4a534c61625f496e647573747269616c5f5365637265745f4b65795f32303234', 'hex'); // 32 bytes
const IV_LENGTH = 16;

export class VaultService {
  private static encrypt(text: string): string {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  }

  private static decrypt(text: string): string {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift()!, 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }

  /**
   * Securely retrieves credentials for a tenant, decrypting sensitive data.
   */
  static async getCredentials(tenantId: string) {
    const credentials = await prisma.credential.findMany({
      where: { tenantId },
      orderBy: { system: 'asc' }
    });

    return credentials.map(cred => ({
      ...cred,
      password: cred.password ? this.decrypt(cred.password) : null
    }));
  }

  static async addCredential(tenantId: string, data: { system: string; username?: string; password?: string }) {
    // Industrial practice: Always log access to sensitive data
    await prisma.activityLog.create({
      data: {
        tenantId,
        user: 'System/Vault',
        action: `Added credential for system: ${data.system}`
      }
    });

    const encryptedPassword = data.password ? this.encrypt(data.password) : undefined;

    return prisma.credential.create({
      data: {
        ...data,
        password: encryptedPassword,
        tenantId
      }
    });
  }

  static async deleteCredential(tenantId: string, id: string) {
    return prisma.credential.delete({
      where: { id, tenantId }
    });
  }
}
