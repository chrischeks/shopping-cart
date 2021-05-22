import { Router } from 'express';
import Route from '@interfaces/route.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import ProductController from '@/controllers/product.controller';
import { ProductDto } from '@/dtos/product.dto';

class ProductRoute implements Route {
  public path = '/products';
  public router = Router();
  public productController = new ProductController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/create`, validationMiddleware(ProductDto, 'body'), this.productController.createProduct);
    this.router.get(`${this.path}`, this.productController.findAllProducts);
  }
}

export default ProductRoute;
