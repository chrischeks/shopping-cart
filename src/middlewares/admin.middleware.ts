import UniversalController from '@/controllers/universal.controller';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { NextFunction, Response } from 'express';

export const isAdmin = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  if (req.user.role !== 'admin') {
    return await new UniversalController().controllerResponseHandler(
      { message: 'You do not have sufficient permission', status: false, statusCode: 401 },
      req,
      res,
    );
  }
  next();
};
