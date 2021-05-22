import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '@dtos/user.dto';
import AuthService from '@services/auth.service';
import UniversalController from '@/controllers/universal.controller';
import { AuthDto } from '@/dtos/auth.dto';

class AuthController extends UniversalController {
  public authService = new AuthService();

  public signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: CreateUserDto = req.body;
      const response = await this.authService.signup(userData);
      this.controllerResponseHandler(response, req, res);
    } catch (error) {
      await this.controllerErrorHandler(req, res, error);
      next();
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>> => {
    try {
      const userData: AuthDto = req.body;
      const response = await this.authService.login(userData);
      const { status, data } = response;
      if (status === false) return this.controllerResponseHandler(response, req, res);
      const { cookie } = data;
      res.setHeader('Set-Cookie', [cookie]);
      this.controllerResponseHandler(response, req, res);
    } catch (error) {
      await this.controllerErrorHandler(req, res, error);
      next();
    }
  };
}

export default AuthController;
