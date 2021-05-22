import { NextFunction, Response } from 'express';
import UniversalController from './universal.controller';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { ProductDto } from '@/dtos/product.dto';
import ProductService from '@/services/product.service';

class ProductController extends UniversalController {
  public productService = new ProductService();

  public createProduct = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const productData: ProductDto = req.body;
      const response = await this.productService.createProduct(productData);
      await this.controllerResponseHandler(response, req, res);
    } catch (error) {
      await this.controllerErrorHandler(req, res, error);
      next();
    }
  };
}

export default ProductController;
