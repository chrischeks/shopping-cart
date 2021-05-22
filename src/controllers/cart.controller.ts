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
}

export default CartController;
