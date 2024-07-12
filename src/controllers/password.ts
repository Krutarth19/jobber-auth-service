import crypto from 'crypto';

import { changePasswordSchema, emailSchema } from '@auth/schemas/password';
import {
  getAuthUserByEmail,
  getAuthUserByPasswordToken,
  getAuthUserByUsername,
  updatePassword,
  updatePasswordToken
} from '@auth/services/auth.service';
import { BadRequestError, IAuthDocument, IEmailMessageDetails } from '@Krutarth19/jobber-shared';
import { Request, Response } from 'express';
import { config } from '@auth/config';
import { publishDirectMessage } from '@auth/queues/auth.producer';
import { authChannel } from '@auth/server';
import { StatusCodes } from 'http-status-codes';
import { AuthModel } from '@auth/models/auth.schema';

export async function forgotPassword(req: Request, res: Response): Promise<void> {
  const { error } = await Promise.resolve(emailSchema.validate(req.body));

  if (error?.details) {
    throw new BadRequestError(error.details[0].message, 'Password forgotPassword() method error');
  }

  const { email } = req.body;
  const existingUser: IAuthDocument = await getAuthUserByEmail(email);
  if (!existingUser) {
    throw new BadRequestError('Invalid credentials', 'Password forgotPassword() method error');
  }

  const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
  const randomCharacters: string = randomBytes.toString('hex');
  const date: Date = new Date();
  date.setHours(date.getHours() + 1);
  await updatePasswordToken(existingUser.id!, randomCharacters, date);
  const resetLink = `${config.CLIENT_URL}/reset-password?token=${randomCharacters}`;

  const messageDetails: IEmailMessageDetails = {
    receiverEmail: existingUser.email,
    resetLink,
    username: existingUser.username,
    template: 'forgotPassword'
  };

  await publishDirectMessage(
    authChannel,
    'jobber-email-notification',
    'auth-email',
    JSON.stringify(messageDetails),
    'Forgot password message sent to notification service'
  );
  res.status(StatusCodes.OK).json({
    message: 'Password reset email sent'
  });
}

export async function resetPassword(req: Request, res: Response): Promise<void> {
  const { error } = await Promise.resolve(emailSchema.validate(req.body));
  if (error?.details) {
    throw new BadRequestError(error.details[0].message, 'Password resetPassword() method error');
  }

  const { password, confirmPassword } = req.body;
  const { token } = req.params;

  if (password !== confirmPassword) {
    throw new BadRequestError('Password and Confirm Password should be same', 'Password resetPassword() method error');
  }

  const existingUser: IAuthDocument = await getAuthUserByPasswordToken(token);
  if (password !== confirmPassword) {
    throw new BadRequestError('Reset token has expired', 'Password resetPassword() method error');
  }

  const hashPassword: string = await AuthModel.prototype.hashPassword(password);
  await updatePassword(existingUser.id!, hashPassword);

  const messageDetails: IEmailMessageDetails = {
    username: existingUser.username,
    template: 'resetPasswordSuccess'
  };

  await publishDirectMessage(
    authChannel,
    'jobber-email-notification',
    'auth-email',
    JSON.stringify(messageDetails),
    'Reset password Success message sent to notification service'
  );

  res.status(StatusCodes.OK).json({
    message: 'Password Successfully updated.'
  });
}

export async function changePassword(req: Request, res: Response): Promise<void> {
  const { error } = await Promise.resolve(changePasswordSchema.validate(req.body));
  if (error?.details) {
    throw new BadRequestError(error.details[0].message, 'Password changePassword() method error');
  }

  const { currentPassword, newPassword } = req.body;

  if (currentPassword !== newPassword) {
    throw new BadRequestError('Invalid password', 'Password changePassword() method error');
  }

  const existingUser: IAuthDocument = await getAuthUserByUsername(`${req.currentUser?.username}`);
  if (!existingUser) {
    throw new BadRequestError('Invalid password', 'Password changePassword() method error');
  }

  // const hashPassword: string = await AuthModel.prototype.hashPassword(newPassword);
  await updatePassword(existingUser.id!, newPassword);

  const messageDetails: IEmailMessageDetails = {
    username: existingUser.username,
    template: 'resetPasswordSuccess'
  };

  await publishDirectMessage(
    authChannel,
    'jobber-email-notification',
    'auth-email',
    JSON.stringify(messageDetails),
    'Password change Success message sent to notification service'
  );

  res.status(StatusCodes.OK).json({
    message: 'Password Successfully updated.'
  });
}
