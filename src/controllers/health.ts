import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export class Health {
  public health(_req: Request, res: Response): void {
    res.status(StatusCodes.OK).send('Auth Service is healthy and OK.');
  }
}
