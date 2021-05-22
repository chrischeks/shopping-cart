import { getRepository } from 'typeorm';
import UniversalService from './universal.service';
import Status from '@/enums/status.enum';
import IResponse from '@/interfaces/response.interface';
import { ProductEntity } from '@/entities/product.entity';
import { ProductDto } from '@/dtos/product.dto';
import { Product } from '@/interfaces/product.interface';
import { Category } from '@/interfaces/category.interface';
import { CategoryEntity } from '@/entities/category.entity';

class ProductService extends UniversalService {
  public products = ProductEntity;
  public categories = CategoryEntity;

  public async createProduct(productData: ProductDto): Promise<IResponse> {
    const productRepository = getRepository(this.products);
    const categoryRepository = getRepository(this.categories);
    const { categoryId, colours, sizes } = productData;
    const name: string = productData.name.toLowerCase();
    const foundCategory: Category = await categoryRepository.findOne(categoryId);

    if (!foundCategory) return this.failureResponse(Status.FAILED_VALIDATION, `Chosen category does not exists.`);
    const product = await productRepository.findOne({ where: { name } });
    if (product) return this.failureResponse(Status.CONFLICT, `${name} already exists.`);
    const data: Product = { ...productData, colours: JSON.stringify(colours), sizes: JSON.stringify(sizes) };
    const createProductData: Product = await productRepository.save({
      ...data,
    });
    return this.successResponse('Product created successfully.', createProductData);
  }

  public async findAllProducts(): Promise<IResponse> {
    const productRepository = getRepository(this.products);
    const foundProduct: Product[] = await productRepository.find({ relations: ['category'] });

    return this.successResponse('Products retrieved successfully.', foundProduct);
  }
}

export default ProductService;
