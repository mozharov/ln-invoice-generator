import Router from '@koa/router';
import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = new Router();

router.get('/', async (ctx) => {
  try {
    const htmlPath = join(__dirname, '../../public/index.html');
    const html = readFileSync(htmlPath, 'utf-8');
    ctx.type = 'html';
    ctx.body = html;
  } catch (error) {
    console.error('Error serving index.html:', error);
    ctx.status = 500;
    ctx.body = 'Internal server error';
  }
});

export default router;