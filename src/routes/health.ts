import { Health } from '@auth/controllers/health';
import express, { Router } from 'express';

const router: Router = express.Router();
export function healthRoutes(): Router {
  router.get('/auth-health', Health.prototype.health);
  return router;
}
