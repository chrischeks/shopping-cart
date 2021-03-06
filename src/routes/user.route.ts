import { Router } from 'express';
import UsersController from '@controllers/user.controller';
import Route from '@interfaces/route.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import verifyKey from '@/middlewares/verify.middleware';
import { isAdmin } from '@/middlewares/admin.middleware';

class UsersRoute implements Route {
  public usersPath = '/users';
  public userPath = '/user';

  public router = Router();
  public usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.userPath}`, verifyKey, authMiddleware, this.usersController.getUserById);
    this.router.get(`${this.usersPath}`, verifyKey, authMiddleware, isAdmin, this.usersController.findAllUsers);
  }
}

export default UsersRoute;
