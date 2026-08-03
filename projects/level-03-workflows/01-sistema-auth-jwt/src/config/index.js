import dotenv from 'dotenv';

// Carga variables de entorno desde .env
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret-change-me',
    // Expiración del access token (default 15m)
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  },
  refreshToken: {
    // Expiración en segundos (default 7 días)
    expiresInSeconds: parseInt(process.env.REFRESH_TOKEN_EXPIRES_SECONDS || '604800', 10),
  },
  databaseUrl: process.env.DATABASE_URL || 'file:./dev.db',
};