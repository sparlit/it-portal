import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import { prisma } from '@/lib/db';

export class MFAService {
  static generateSecret() {
    return authenticator.generateSecret();
  }

  static async getQRCode(username: string, secret: string) {
    const otpauth = authenticator.keyuri(username, 'Artemis-Industrial', secret);
    return QRCode.toDataURL(otpauth);
  }

  static verifyToken(token: string, secret: string) {
    return authenticator.verify({ token, secret });
  }

  static async enableMFA(userId: string, secret: string) {
    // Note: In a production schema, we'd have an mfaSecret field on the User model
    // For now, we'll store it in the Settings model as a secure preference
    return prisma.cORE_Setting.upsert({
      where: {
        tenantId_key: {
          tenantId: 'system', // or global
          key: `mfa_secret_${userId}`
        }
      },
      update: { value: secret },
      create: {
        tenantId: 'system',
        key: `mfa_secret_${userId}`,
        value: secret
      }
    });
  }
}
