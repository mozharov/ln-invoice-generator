import config from '../config.js';

const RATE_LIMIT = {
  maxRequests: config.rateLimit.maxRequests,
  windowMs: config.rateLimit.windowMs,
  cleanupInterval: 300000
};

const rateLimiter = new Map();

export async function rateLimit(ctx, next) {
  const ip = ctx.ip;
  const now = Date.now();
  
  const record = rateLimiter.get(ip);
  
  if (!record || now > record.resetAt) {
    rateLimiter.set(ip, {
      count: 1,
      resetAt: now + RATE_LIMIT.windowMs
    });
    return next();
  }
  
  if (record.count >= RATE_LIMIT.maxRequests) {
    ctx.status = 429;
    ctx.body = { success: false, error: 'Rate limit exceeded' };
    return;
  }
  
  record.count++;
  return next();
}

setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimiter.entries()) {
    if (now > record.resetAt + RATE_LIMIT.windowMs) {
      rateLimiter.delete(ip);
    }
  }
}, RATE_LIMIT.cleanupInterval);

export default rateLimit;