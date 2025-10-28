// config/configs.js - Exportación centralizada
// config/configs.js
export { corsMiddleware, corsErrorHandler } from './cors.js';
export { dbConfig, connectDatabase } from './database.js';
export { authConfig } from './auth.js';

export { serverConfig } from './serverConfig.js';
export {
  validateEnvironment,
  getEnvironmentConfig,
  requiredEnvVars,
} from './environment.js';
export { ROLE, CODE, PAGINATION, LIMIT } from './constants.js';
