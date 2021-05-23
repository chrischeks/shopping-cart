import { Router } from 'express';
import Route from '@interfaces/route.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import CartController from '@/controllers/cart.controller';
import authMiddleware from '@/middlewares/auth.middleware';
import { BaseCartDTO, CartDto, UpdateCartDto } from '@/dtos/cart.dto';
// import { CartDto } from '@/dtos/cart.dto';

class CartRoute implements Route {
  public path = '/cart';
  public router = Router();
  public cartController = new CartController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/add-to-cart`, authMiddleware, validationMiddleware(CartDto, 'body'), this.cartController.addToCart);
    this.router.put(`${this.path}/update-cart`, authMiddleware, validationMiddleware(UpdateCartDto, 'body'), this.cartController.updateCartItem);
    this.router.delete(
      `${this.path}/remove-item/:productId`,
      authMiddleware,
      validationMiddleware(BaseCartDTO, 'params'),
      this.cartController.removeCartItem,
    );
    this.router.get(`${this.path}`, authMiddleware, this.cartController.userCart);
  }
}

export default CartRoute;
