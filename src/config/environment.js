export const requiredEnvVars = ['URLDB', 'JWT_SECRET', 'FRONTEND_URL'];

export const validateEnvironment = () => {
  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingVars);
    console.log('💡 Please check your .env file');
    process.exit(1);
  }

  console.log('✅ All required environment variables are set');
};

// Configuration by environment
export const getEnvironmentConfig = () => {
  const env = process.env.NODE_ENV || 'development';

  const configs = {
    development: {
      logLevel: 'debug',
      cors: { origin: true },
      database: { debug: true },
    },
    production: {
      logLevel: 'warn',
      cors: { origin: process.env.FRONTEND_URL },
      database: { debug: false },
    },
    test: {
      logLevel: 'error',
      cors: { origin: true },
      database: { debug: false },
    },
  };

  return configs[env] || configs.development;
};
