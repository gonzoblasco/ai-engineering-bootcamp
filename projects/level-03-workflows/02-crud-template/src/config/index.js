import dotenv from 'dotenv';

dotenv.config();

export const env = {
  DATABASE_URL: process.env.DATABASE_URL || 'file:./dev.db',
  PORT: parseInt(process.env.PORT || '3000', 10),
};