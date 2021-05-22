import { Router } from 'express';
import Route from '@interfaces/route.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import { CategoryDto } from '@/dtos/category.dto';
import CategoryController from '@/controllers/category.controller';

class CategoryRoute implements Route {
  public path = '/product-category';
  public router = Router();
  public categoryController = new CategoryController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/create`, validationMiddleware(CategoryDto, 'body'), this.categoryController.createCategory);
  }
}

export default CategoryRoute;
