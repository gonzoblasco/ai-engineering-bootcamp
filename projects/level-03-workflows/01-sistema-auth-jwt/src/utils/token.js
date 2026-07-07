import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import { config } from '../config/index.js';

/**
 * Genera un access token JWT firmado para un usuario.
 * Contiene el id y el rol necesarios para autorización.
 */
export function generateAccessToken(user) {
  return jwt.sign(
    { sub: user.id, role: user.role, email: user.email },
    config.jwt.secret,
    { expiresIn: config.jwt.accessExpiresIn },
  );
}

/**
 * Genera un refresh token aleatorio opaco (no JWT).
 * Se guarda en DB para poder revocarlo y rotarlo.
 */
export function generateRefreshTokenValue() {
  return randomBytes(48).toString('hex');
}

/**
 * Verifica un access token JWT. Lanza si es inválido o expirado.
 */
export function verifyAccessToken(token) {
  return jwt.verify(token, config.jwt.secret);
}