import { getAuthUserById, getAuthUserByVerificationToken, updateVerifyEmailField } from '@auth/services/auth.service';
import { BadRequestError, IAuthDocument } from '@Krutarth19/jobber-shared';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export async function update(req: Request, res: Response): Promise<void> {
  const { token } = req.body;

  const checkIfUserExists: IAuthDocument = await getAuthUserByVerificationToken(token);

  if (!checkIfUserExists) {
    throw new BadRequestError('Verification token is either invalid or is already used', 'VerifyEmail update() method error');
  }

  await updateVerifyEmailField(checkIfUserExists.id!, 1, '');
  const updateUser = await getAuthUserById(checkIfUserExists.id!);
  res.status(StatusCodes.OK).json({
    message: 'Email verified successfully',
    user: updateUser
  });
}
