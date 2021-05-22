import { Router } from 'express';
import AuthController from '@controllers/auth.controller';
import { CreateUserDto } from '@dtos/user.dto';
import Route from '@interfaces/route.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import { AuthDto } from '@/dtos/auth.dto';

class AuthRoute implements Route {
  public path = '/auth';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/signup`, validationMiddleware(CreateUserDto, 'body'), this.authController.signUp);
    this.router.post(`${this.path}/login`, validationMiddleware(AuthDto, 'body'), this.authController.logIn);
  }
}

export default AuthRoute;
