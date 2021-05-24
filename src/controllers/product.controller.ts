import { NextFunction, Response, Request } from 'express';
import UniversalController from './universal.controller';
import { ProductDto } from '@/dtos/product.dto';
import ProductService from '@/services/product.service';

class ProductController extends UniversalController {
  public productService = new ProductService();

  public createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const productData: ProductDto = req.body;
      const response = await this.productService.createProduct(productData);
      await this.controllerResponseHandler(response, req, res);
    } catch (error) {
      await this.controllerErrorHandler(req, res, error);
      next();
    }
  };

  public findAllProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const productData: any = req.query;
      const response = await this.productService.findAllProducts(productData);
      await this.controllerResponseHandler(response, req, res);
    } catch (error) {
      await this.controllerErrorHandler(req, res, error);
      next();
    }
  };
}

export default ProductController;
