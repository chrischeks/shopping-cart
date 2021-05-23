import { NextFunction, Response } from 'express';
import userService from '@/services/user.service';
import UniversalController from './universal.controller';
import { RequestWithUser } from '@/interfaces/auth.interface';

class UsersController extends UniversalController {
  public userService = new userService();

  public getUserById = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.controllerResponseHandler({ statusCode: 200, status: true, message: 'success', data: req.user }, req, res);
    } catch (error) {
      await this.controllerErrorHandler(req, res, error);
      next();
    }
  };

  public findAllUsers = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await this.userService.findAllUsers(req.query);
      await this.controllerResponseHandler(response, req, res);
    } catch (error) {
      await this.controllerErrorHandler(req, res, error);
      next();
    }
  };
}

export default UsersController;
