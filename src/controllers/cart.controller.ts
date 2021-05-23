import { Request, NextFunction, Response } from 'express';
import UniversalController from './universal.controller';
import { RequestWithUser } from '@/interfaces/auth.interface';
import CartService from '@/services/cart.service';
import { CartDto } from '@/dtos/cart.dto';

class CartController extends UniversalController {
  public cartService = new CartService();

  public addToCart = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { user, body } = req;
      const cartData: CartDto = body;
      const userId: string = user.id;
      const response = await this.cartService.addItemToCart(cartData, userId);
      await this.controllerResponseHandler(response, req, res);
    } catch (error) {
      await this.controllerErrorHandler(req, res, error);
      next();
    }
  };

  public updateCartItem = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { user, body } = req;
      const userId: string = user.id;
      const cartData: CartDto = body;
      const response = await this.cartService.updateCart(cartData, userId);
      await this.controllerResponseHandler(response, req, res);
    } catch (error) {
      await this.controllerErrorHandler(req, res, error);
      next();
    }
  };

  public removeCartItem = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { user, params } = req;
      const userId: string = user.id;
      const { productId } = params;
      const response = await this.cartService.removeCartItem(productId, userId);
      await this.controllerResponseHandler(response, req, res);
    } catch (error) {
      await this.controllerErrorHandler(req, res, error);
      next();
    }
  };

  public userCart = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId: string = req.user.id;
      const response = await this.cartService.userCart(userId);
      await this.controllerResponseHandler(response, req, res);
    } catch (error) {
      await this.controllerErrorHandler(req, res, error);
      next();
    }
  };
}

export default CartController;
