/**
 * Configuración centralizada de la aplicación.
 *
 * Carga las variables de entorno desde .env usando dotenv y las expone
 * como un objeto tipado y validado. De esta forma el resto del código
 * no depende directamente de process.env y es más fácil de testear.
 */
import dotenv from 'dotenv';

// Carga las variables del archivo .env en process.env
dotenv.config();

export const config = {
  /** Puerto donde escucha el servidor HTTP. Por defecto 3000. */
  port: parseInt(process.env.PORT, 10) || 3000,

  /** Entorno de ejecución: 'development' | 'production' | 'test'. */
  nodeEnv: process.env.NODE_ENV || 'development',

  /** Origen permitido para CORS. */
  corsOrigin: process.env.CORS_ORIGIN || '*',

  /** Conveniencia: ¿estamos en producción? */
  get isProduction() {
    return this.nodeEnv === 'production';
  },
};