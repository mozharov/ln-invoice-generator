import Koa from 'koa';
import bodyParser from '@koa/bodyparser';
import serve from 'koa-static';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import config from './config.js';
import errorHandler from './middleware/errorHandler.js';
import apiRouter from './routes/api.js';
import webRouter from './routes/web.js';
import './db.js'; // Initialize database
import cors from '@koa/cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = new Koa();
// Trust proxy headers for correct IP detection
app.proxy = true;

// Global error handling
app.use(errorHandler);
app.use(cors());

// Body parser middleware
app.use(bodyParser({
  jsonLimit: '1mb',
  textLimit: '1mb'
}));

// Static file serving
app.use(serve(join(__dirname, '../public')));

// Routes
app.use(webRouter.routes()).use(webRouter.allowedMethods());
app.use(apiRouter.routes()).use(apiRouter.allowedMethods());

// Error event handler
app.on('error', (err, ctx) => {
  console.error('Server error:', err, ctx?.url);
});

const server = app.listen(config.port, () => {
  console.log(`🚀 Lightning Invoice Generator running on http://localhost:${config.port}`);
  console.log(`🌐 Public host: ${config.host}`);
  console.log(`📊 Database: ${config.databasePath}`);
  console.log(`🔒 Rate limit: ${config.rateLimit.maxRequests} requests per ${config.rateLimit.windowMs/1000} seconds`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});