import request from 'supertest';
import { createConnection, getRepository } from 'typeorm';
import App from '@/app';
import { dbConnection } from '@databases';
import { ProductDto } from '@/dtos/product.dto';
import ProductRoute from '@/routes/product.route';
import CategoryRoute from '@/routes/category.route';
import crypto from 'crypto';
import config from 'config';
const basePath = '/api/v1';

const API_KEY = config.get('api_key');
const timestamp = `${Date.now()}`;
const text = `${API_KEY}|${timestamp}`;
const key = crypto.createHash('sha512', API_KEY).update(text).digest('hex');

beforeAll(async () => {
  await createConnection(dbConnection);
});

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing Category', () => {
  describe('[POST] /product-category', () => {
    it('should create a product category', async () => {
      const productData: ProductDto = {
        name: 'Nivea Deodorant',
        sku: 'nide-01',
        description: 'Our product helps you to keep your skin dry all day long.',
        sellingPrice: 900,
        stockLevel: 100,
        categoryId: 'c9c0573f-c5e3-47aa-8040-3efb231c3d3f',
        imageURL: 'https://i.picsum.photos/id/7/200/300.jpg?hmac=_vgE8dZdzp3B8T1C9VrGrIMBkDOkFYbJNWqzJD47xNg',
        colours: ['red', 'white'],
        sizes: ['sm', 'l'],
      };
      const categoryData = {
        id: 'fabe29e6-964d-4a1a-9a84-e1a3bff62278',
        name: 'category 1',
        imageURL: 'http://test-category.com',
        description: 'This category is for all sportwears, jewelry, baby clothing, ethinic garment, etc products',
        createdAt: '2021-05-18T22:47:22.998Z',
        updatedAt: '2021-05-18T22:47:22.998Z',
      };
      const { name, description, imageURL } = productData;
      const productRoute = new ProductRoute();
      const categoryRoute = new CategoryRoute();
      const category = categoryRoute.categoryController.categoryService.categories;
      const product = productRoute.productController.productService.products;
      const productRepository = getRepository(product);
      const categoryRepository = getRepository(category);

      categoryRepository.findOne = jest.fn().mockReturnValue(categoryData);

      productRepository.findOne = jest.fn().mockReturnValue(null);
      productRepository.save = jest.fn().mockReturnValue({
        ...productData,
        category: categoryData,
      });

      const app = new App([productRoute]);
      const appRequest = request(app.getServer());
      const { body, status } = await appRequest
        .post(`${basePath}${productRoute.path}/create`)
        .set('x-api-key', key)
        .set('x-timestamp', timestamp)
        .send(productData);
      expect(status).toBe(200);
      expect(body.status).toBe(true);
      expect(body.data).toMatchObject(productData);
    });

    it('should list out all the products', async () => {
      const productData = [
        {
          id: '8833902b-0b7d-485e-a0de-5e4eba50b2e2',
          name: 'nivea deodorant',
          sku: 'nide-01',
          imageURL: 'https://i.picsum.photos/id/7/200/300.jpg?hmac=_vgE8dZdzp3B8T1C9VrGrIMBkDOkFYbJNWqzJD47xNg',
          stockLevel: 100,
          sellingPrice: 900,
          description: 'Our product helps you to keep your skin dry all day long.',
          colours: null,
          sizes: null,
          createdAt: '2021-05-19T00:04:20.244Z',
          updatedAt: '2021-05-19T00:04:20.244Z',
          category: {
            id: 'fabe29e6-964d-4a1a-9a84-e1a3bff62278',
            name: 'cloth',
            imageURL: 'http://test-category.com',
            description: 'This category is for all sportwears, jewelry, baby clothing, ethinic garment, etc products',
            createdAt: '2021-05-18T22:47:22.998Z',
            updatedAt: '2021-05-18T22:47:22.998Z',
          },
        },
      ];
      const productRoute = new ProductRoute();

      const product = productRoute.productController.productService.products;
      const productRepository = getRepository(product);
      productRepository.find = jest.fn().mockReturnValue(productData);

      const app = new App([productRoute]);
      const appRequest = request(app.getServer());
      const { body, status } = await appRequest.get(`${basePath}${productRoute.path}`).set('x-api-key', key).set('x-timestamp', timestamp);
      console.log(body, 'body');

      expect(status).toBe(200);
      expect(body.status).toBe(true);
      expect(body.data).toMatchObject(productData);
    });
  });
});
