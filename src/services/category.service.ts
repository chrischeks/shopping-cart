import { getRepository } from 'typeorm';
import UniversalService from './universal.service';
import Status from '@/enums/status.enum';
import { CategoryDto } from '@/dtos/category.dto';
import { Category } from '@/interfaces/category.interface';
import { CategoryEntity } from '@/entities/category.entity';
import IResponse from '@/interfaces/response.interface';
import { PaginationDto } from '@/dtos/pagination.dto';

class CategoryService extends UniversalService {
  public categories = CategoryEntity;

  public async createCategory(categoryData: CategoryDto): Promise<IResponse> {
    const categoryRepository = getRepository(this.categories);
    const name: string = categoryData.name.toLowerCase();
    const foundCategory: Category = await categoryRepository.findOne({ where: { name } });
    if (foundCategory) return this.failureResponse(Status.CONFLICT, `${name} category already exists`);
    const createUserData: Category = await categoryRepository.save({
      ...categoryData,
      name,
    });
    return this.successResponse('Category created successfully', createUserData);
  }

  public async findAllCategories(query: PaginationDto): Promise<IResponse> {
    const { take = 10, skip = 0 } = query;
    const categoryRepository = getRepository(this.categories);
    const foundCategory: Category[] = await categoryRepository.find({ order: { createdAt: 'DESC' }, take, skip });

    return this.successResponse('Categories retrieved successfully', foundCategory);
  }
}

export default CategoryService;
