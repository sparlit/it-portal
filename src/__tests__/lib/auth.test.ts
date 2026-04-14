import { describe, it, expect, vi, beforeEach } from 'vitest';

// We need to set JWT_SECRET before importing auth module
process.env.JWT_SECRET = 'test-secret-key-for-testing-only-32chars';

import { encrypt, decrypt } from '@/lib/auth';

describe('lib/auth', () => {
  describe('encrypt', () => {
    it('should return a string JWT token', async () => {
      const payload = { user: { id: '1', username: 'testuser' }, expires: new Date() };
      const token = await encrypt(payload);
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    it('should produce different tokens for different payloads', async () => {
      const payload1 = { user: { id: '1' }, expires: new Date() };
      const payload2 = { user: { id: '2' }, expires: new Date() };
      const token1 = await encrypt(payload1);
      const token2 = await encrypt(payload2);
      expect(token1).not.toBe(token2);
    });

    it('should produce tokens with HS256 algorithm', async () => {
      const payload = { user: { id: '1' }, expires: new Date() };
      const token = await encrypt(payload);
      const header = JSON.parse(Buffer.from(token.split('.')[0], 'base64url').toString());
      expect(header.alg).toBe('HS256');
    });
  });

  describe('decrypt', () => {
    it('should decrypt a token back to its payload', async () => {
      const originalPayload = { user: { id: '1', username: 'testuser', role: 'admin' }, expires: new Date().toISOString() };
      const token = await encrypt(originalPayload);
      const decrypted = await decrypt(token);
      expect(decrypted.user.id).toBe('1');
      expect(decrypted.user.username).toBe('testuser');
      expect(decrypted.user.role).toBe('admin');
    });

    it('should throw an error for invalid tokens', async () => {
      await expect(decrypt('invalid.token.string')).rejects.toThrow();
    });

    it('should throw an error for tampered tokens', async () => {
      const payload = { user: { id: '1' }, expires: new Date().toISOString() };
      const token = await encrypt(payload);
      const parts = token.split('.');
      // Tamper with the signature
      const tampered = `${parts[0]}.${parts[1]}.invalidsignature`;
      await expect(decrypt(tampered)).rejects.toThrow();
    });

    it('should throw for empty string token', async () => {
      await expect(decrypt('')).rejects.toThrow();
    });

    it('should preserve complex nested user objects', async () => {
      const payload = {
        user: {
          id: 'user-123',
          username: 'john',
          name: 'John Doe',
          role: 'it_manager',
          tenantId: 'tenant-abc'
        },
        expires: new Date().toISOString()
      };
      const token = await encrypt(payload);
      const decrypted = await decrypt(token);
      expect(decrypted.user.tenantId).toBe('tenant-abc');
      expect(decrypted.user.name).toBe('John Doe');
    });
  });

  describe('encrypt and decrypt roundtrip', () => {
    it('should roundtrip successfully with all user fields', async () => {
      const userData = {
        id: 'abc123',
        username: 'jane.doe',
        name: 'Jane Doe',
        role: 'admin',
        tenantId: 'tenant-xyz'
      };
      const token = await encrypt({ user: userData, expires: new Date() });
      const result = await decrypt(token);
      expect(result.user.id).toBe(userData.id);
      expect(result.user.username).toBe(userData.username);
      expect(result.user.role).toBe(userData.role);
      expect(result.user.tenantId).toBe(userData.tenantId);
    });
  });
});