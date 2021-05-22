import { Router } from 'express';
import UsersController from '@controllers/user.controller';
import Route from '@interfaces/route.interface';
import authMiddleware from '@/middlewares/auth.middleware';

class UsersRoute implements Route {
  public userPath = '/user';

  public router = Router();
  public usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.userPath}`, authMiddleware, this.usersController.getUserById);
  }
}

export default UsersRoute;
