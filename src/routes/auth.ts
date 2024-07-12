import { changePassword, forgotPassword, resetPassword } from '@auth/controllers/password';
import { signIn } from '@auth/controllers/signin';
import { signUp } from '@auth/controllers/signup';
import { update } from '@auth/controllers/verify-email';
import express, { Router } from 'express';

const router: Router = express.Router();

export function authRoutes(): Router {
  router.post('/signup', signUp);
  router.post('/signin', signIn);
  router.put('/verify-email', update);
  router.put('/forgot-password', forgotPassword);
  router.put('/reset-password/:token', resetPassword);
  router.put('/change-password', changePassword);


  return router;
}
