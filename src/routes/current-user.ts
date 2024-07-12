import { read, resendEmail } from '@auth/controllers/current-user';
import { token } from '@auth/controllers/refresh-token';
import express, { Router } from 'express';

const router: Router = express.Router();

export function currentUserRoutes(): Router {
  router.get('/currentuser', read);
  router.post('/resend-email', resendEmail);
  router.get('/refresh-token/:username', token);

  return router;
}
