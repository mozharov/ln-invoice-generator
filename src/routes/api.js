import Router from '@koa/router';
import crypto from 'crypto';
import { getUserByNwcSecret, getUserById, insertUser } from '../db.js';
import { validateNWCSecret, createInvoice } from '../services/lightning.js';
import { validateAmount, validateDescription, validateNWCFormat } from '../utils/validation.js';
import rateLimit from '../middleware/rateLimit.js';
import config from '../config.js';

const router = new Router({ prefix: '/api' });

router.post('/register', async (ctx) => {
  try {
    const { nwc_secret } = ctx.request.body;
    
    if (!nwc_secret) {
      ctx.status = 400;
      ctx.body = { success: false, error: 'NWC secret is required' };
      return;
    }
    
    const formatValidation = validateNWCFormat(nwc_secret);
    if (!formatValidation.valid) {
      ctx.status = 400;
      ctx.body = { success: false, error: formatValidation.error };
      return;
    }
    
    const connectionValidation = await validateNWCSecret(nwc_secret);
    if (!connectionValidation.valid) {
      ctx.status = 503;
      ctx.body = { success: false, error: 'NWC endpoint unavailable or invalid: ' + connectionValidation.error };
      return;
    }
    
    let user = getUserByNwcSecret.get(nwc_secret);
    
    if (user) {
      ctx.body = {
        success: true,
        endpoint: `${config.host}/api/invoice/${user.id}`,
        id: user.id
      };
      return;
    }
    
    const id = crypto.randomUUID();
    
    try {
      insertUser.run(id, nwc_secret);
      
      ctx.body = {
        success: true,
        endpoint: `${config.host}/api/invoice/${id}`,
        id: id
      };
    } catch (dbError) {
      console.error('Database error:', dbError);
      ctx.status = 500;
      ctx.body = { success: false, error: 'Internal server error' };
    }
    
  } catch (error) {
    console.error('Registration error:', error);
    ctx.status = 500;
    ctx.body = { success: false, error: 'Internal server error' };
  }
});

router.post('/invoice/:id', rateLimit, async (ctx) => {
  try {
    const { id } = ctx.params;
    const { amount, description } = ctx.request.body;
    
    if (!amount) {
      ctx.status = 400;
      ctx.body = { success: false, error: 'Amount is required' };
      return;
    }
    
    const amountValidation = validateAmount(amount);
    if (!amountValidation.valid) {
      ctx.status = 400;
      ctx.body = { success: false, error: amountValidation.error };
      return;
    }
    
    const descValidation = validateDescription(description);
    if (!descValidation.valid) {
      ctx.status = 400;
      ctx.body = { success: false, error: descValidation.error };
      return;
    }
    
    const user = getUserById.get(id);
    if (!user) {
      ctx.status = 404;
      ctx.body = { success: false, error: 'ID not found' };
      return;
    }
    
    const invoiceResult = await createInvoice(user.nwc_secret, amount, description);
    
    if (invoiceResult.success) {
      ctx.body = {
        success: true,
        invoice: invoiceResult.invoice,
        amount: amount
      };
    } else {
      ctx.status = 503;
      ctx.body = { success: false, error: 'NWC endpoint unavailable: ' + invoiceResult.error };
    }
    
  } catch (error) {
    console.error('Invoice generation error:', error);
    ctx.status = 500;
    ctx.body = { success: false, error: 'Internal server error' };
  }
});

export default router;