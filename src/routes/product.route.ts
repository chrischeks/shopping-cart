import { Router } from 'express';
import Route from '@interfaces/route.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import ProductController from '@/controllers/product.controller';
import { ProductDto } from '@/dtos/product.dto';
import verifyKey from '@/middlewares/verify.middleware';
import authMiddleware from '@/middlewares/auth.middleware';
import { isAdmin } from '@/middlewares/admin.middleware';

class ProductRoute implements Route {
  public path = '/products';
  public router = Router();
  public productController = new ProductController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/create`,
      verifyKey,
      authMiddleware,
      isAdmin,
      validationMiddleware(ProductDto, 'body'),
      this.productController.createProduct,
    );
    this.router.get(`${this.path}`, verifyKey, authMiddleware, this.productController.findAllProducts);
  }
}

export default ProductRoute;
