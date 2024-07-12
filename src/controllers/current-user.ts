import crypto from 'crypto';

import { getAuthUserByEmail, getAuthUserById, updateVerifyEmailField } from '@auth/services/auth.service';
import { BadRequestError, IAuthDocument, IEmailMessageDetails, lowerCase } from '@Krutarth19/jobber-shared';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { config } from '@auth/config';
import { authChannel } from '@auth/server';
import { publishDirectMessage } from '@auth/queues/auth.producer';

export async function read(req: Request, res: Response): Promise<void> {
  let user = null;
  const existingUser: IAuthDocument = await getAuthUserById(req.currentUser!.id);
  if (Object.keys(existingUser).length) {
    user = existingUser;
  }

  res.status(StatusCodes.OK).json({
    message: 'Authenticated user',
    user
  });
}

export async function resendEmail(req: Request, res: Response): Promise<void> {
  const { email, userId } = req.body;

  const checkIfUserExist: IAuthDocument = await getAuthUserByEmail(lowerCase(email));
  if (!checkIfUserExist) {
    throw new BadRequestError('Email is invalid', 'Current resendEmail() method error');
  }

  const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
  const randomCharacters: string = randomBytes.toString('hex');
  const verificationLink = `${config.CLIENT_URL}/confirm_email?v_token=${randomCharacters}`;

  await updateVerifyEmailField(parseInt(userId), 0, randomCharacters);
  const messageDetails: IEmailMessageDetails = {
    receiverEmail: lowerCase(email),
    verifyLink: verificationLink,
    template: 'verifyEmail'
  };

  await publishDirectMessage(
    authChannel,
    'jobber-email-notification',
    'auth-email',
    JSON.stringify(messageDetails),
    'Verify email message has been sent to notification service'
  );

  const updatedUser: IAuthDocument = await getAuthUserById(parseInt(userId));
  res.status(StatusCodes.CREATED).json({
    message: 'Verification email sent',
    user: updatedUser
  });
}
