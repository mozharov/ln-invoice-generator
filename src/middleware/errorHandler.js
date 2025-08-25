import config from '../config.js';

export async function errorHandler(ctx, next) {
  try {
    await next();
  } catch (err) {
    console.error('Unhandled error:', err);
    
    ctx.status = err.status || 500;
    
    // Don't leak error details in production
    const isDev = config.nodeEnv === 'development';
    
    ctx.body = {
      success: false,
      error: isDev ? err.message : 'Internal server error'
    };
    
    // Emit error for logging
    ctx.app.emit('error', err, ctx);
  }
}

export default errorHandler;