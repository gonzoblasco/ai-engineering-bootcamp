import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import jwt from 'jsonwebtoken';

// Mock de la configuración para controlar secret y expiración en los tests
jest.unstable_mockModule('../src/config/index.js', () => ({
  config: {
    jwt: {
      secret: 'test-secret-key',
      accessExpiresIn: '1h',
    },
  },
}));

const { generateAccessToken, generateRefreshTokenValue, verifyAccessToken } =
  await import('../src/utils/token.js');

describe('token utils', () => {
  const user = { id: 'user-123', role: 'admin', email: 'test@example.com' };

  describe('generateAccessToken', () => {
    it('debería generar un JWT válido para el usuario', () => {
      const token = generateAccessToken(user);

      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3); // header.payload.signature
    });

    it('debería incluir sub, role y email en el payload', () => {
      const token = generateAccessToken(user);
      const decoded = jwt.verify(token, 'test-secret-key');

      expect(decoded.sub).toBe(user.id);
      expect(decoded.role).toBe(user.role);
      expect(decoded.email).toBe(user.email);
    });

    it('debería respetar la expiración configurada', () => {
      const token = generateAccessToken(user);
      const decoded = jwt.verify(token, 'test-secret-key');

      // 1h = 3600s de tolerancia
      expect(decoded.exp - decoded.iat).toBe(3600);
    });
  });

  describe('generateRefreshTokenValue', () => {
    it('debería retornar un string hexadecimal de 96 caracteres', () => {
      const token = generateRefreshTokenValue();

      expect(typeof token).toBe('string');
      expect(token).toMatch(/^[0-9a-f]+$/);
      // 48 bytes = 96 chars hex
      expect(token.length).toBe(96);
    });

    it('debería generar tokens únicos en llamadas sucesivas', () => {
      const token1 = generateRefreshTokenValue();
      const token2 = generateRefreshTokenValue();

      expect(token1).not.toBe(token2);
    });
  });

  describe('verifyAccessToken', () => {
    it('debería verificar y decodificar un token válido', () => {
      const token = generateAccessToken(user);
      const decoded = verifyAccessToken(token);

      expect(decoded.sub).toBe(user.id);
      expect(decoded.role).toBe(user.role);
      expect(decoded.email).toBe(user.email);
    });

    it('debería lanzar un error para un token con firma inválida', () => {
      const token = jwt.sign({ sub: user.id }, 'otro-secreto');

      expect(() => verifyAccessToken(token)).toThrow();
    });

    it('debería lanzar un error para un token malformado', () => {
      expect(() => verifyAccessToken('not-a-valid-token')).toThrow();
    });

    it('debería lanzar un error para un token expirado', () => {
      const expiredToken = jwt.sign({ sub: user.id }, 'test-secret-key', {
        expiresIn: '-1s',
      });

      expect(() => verifyAccessToken(expiredToken)).toThrow();
    });
  });
});