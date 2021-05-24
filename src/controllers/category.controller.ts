import { NextFunction, Response, Request } from 'express';
import UniversalController from './universal.controller';
import { RequestWithUser } from '@/interfaces/auth.interface';
import CategoryService from '@/services/category.service';
import { CategoryDto } from '@/dtos/category.dto';
import { PaginationDto } from '@/dtos/pagination.dto';

class CategoryController extends UniversalController {
  public categoryService = new CategoryService();

  public createCategory = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categoryData: CategoryDto = req.body;
      const response = await this.categoryService.createCategory(categoryData);
      await this.controllerResponseHandler(response, req, res);
    } catch (error) {
      await this.controllerErrorHandler(req, res, error);
      next();
    }
  };

  public findAllCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categoryData: any = req.query;
      const response = await this.categoryService.findAllCategories(categoryData);
      await this.controllerResponseHandler(response, req, res);
    } catch (error) {
      await this.controllerErrorHandler(req, res, error);
      next();
    }
  };
}

export default CategoryController;
