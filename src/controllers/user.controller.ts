import { NextFunction, Response, Request } from 'express';
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

  public findAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: any = req.query;
      const response = await this.userService.findAllUsers(userData);
      await this.controllerResponseHandler(response, req, res);
    } catch (error) {
      await this.controllerErrorHandler(req, res, error);
      next();
    }
  };
}

export default UsersController;
