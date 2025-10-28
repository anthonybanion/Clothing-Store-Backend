export const serverConfig = {
  port: process.env.PORT || 3000,
  environment: process.env.NODE_ENV || 'development',
  appName: process.env.APP_NAME || 'My Express App',

  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // máximo 100 requests por ventana
  },

  // Helmet security
  helmet: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  },
};

export default serverConfig;
