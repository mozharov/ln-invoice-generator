export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  databasePath: process.env.DATABASE_PATH || './data/invoices.db',
  host: process.env.HOST || 'http://localhost:3000',
  rateLimit: {
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX) || 10,
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000
  }
};

export default config;