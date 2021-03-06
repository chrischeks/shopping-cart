import { Router } from 'express';
import Route from '@interfaces/route.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import CartController from '@/controllers/cart.controller';
import authMiddleware from '@/middlewares/auth.middleware';
import { BaseCartDTO, CartDTO, UpdateCartDTO } from '@/dtos/cart.dto';
import verifyKey from '@/middlewares/verify.middleware';

class CartRoute implements Route {
  public path = '/cart';
  public router = Router();
  public cartController = new CartController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/add-to-cart`, verifyKey, authMiddleware, validationMiddleware(CartDTO, 'body'), this.cartController.addToCart);
    this.router.put(
      `${this.path}/update-cart`,
      verifyKey,
      authMiddleware,
      validationMiddleware(UpdateCartDTO, 'body'),
      this.cartController.updateCartItem,
    );
    this.router.delete(
      `${this.path}/remove-item/:productId`,
      verifyKey,
      authMiddleware,
      validationMiddleware(BaseCartDTO, 'params'),
      this.cartController.removeCartItem,
    );
    this.router.get(`${this.path}`, verifyKey, authMiddleware, this.cartController.userCart);
  }
}

export default CartRoute;
