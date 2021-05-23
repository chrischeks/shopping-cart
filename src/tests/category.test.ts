import request from 'supertest';
import { createConnection, getRepository } from 'typeorm';
import App from '@/app';
import { dbConnection } from '@databases';
import { CategoryDto } from '@/dtos/category.dto';
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
      const categoryData: CategoryDto = {
        name: 'cloth',
        description: 'This is a test description',
        imageURL: 'https://test-image-url.com',
      };
      const { name, description, imageURL } = categoryData;
      const categoryRoute = new CategoryRoute();

      const category = categoryRoute.categoryController.categoryService.categories;
      const categoryRepository = getRepository(category);

      categoryRepository.findOne = jest.fn().mockReturnValue(null);
      categoryRepository.save = jest.fn().mockReturnValue({
        id: 1,
        name,
        description,
        imageURL,
      });

      const app = new App([categoryRoute]);
      const appRequest = request(app.getServer());
      const { body, status } = await appRequest
        .post(`${basePath}${categoryRoute.path}/create`)
        .set('x-api-key', key)
        .set('x-timestamp', timestamp)
        .send(categoryData);

      expect(status).toBe(200);
      expect(body.status).toBe(true);
      expect(body.data).toMatchObject(categoryData);
    });

    it('should list out all the categories', async () => {
      const categoryData = [
        {
          id: 'fabe29e6-964d-4a1a-9a84-e1a3bff62278',
          name: 'category 1',
          imageURL: 'http://test-category.com',
          description: 'This category is for all sportwears, jewelry, baby clothing, ethinic garment, etc products',
          createdAt: '2021-05-18T22:47:22.998Z',
          updatedAt: '2021-05-18T22:47:22.998Z',
        },
        {
          id: 'fabe29e6-964d-4a1a-9a84-e1a3bff62278',
          name: 'category 2',
          imageURL: 'http://test-category.com',
          description: 'This category is for all sportwears, jewelry, baby clothing, ethinic garment, etc products',
          createdAt: '2021-05-18T22:47:22.998Z',
          updatedAt: '2021-05-18T22:47:22.998Z',
        },
      ];
      const categoryRoute = new CategoryRoute();

      const category = categoryRoute.categoryController.categoryService.categories;
      const categoryRepository = getRepository(category);

      categoryRepository.find = jest.fn().mockReturnValue(categoryData);

      const app = new App([categoryRoute]);
      const appRequest = request(app.getServer());
      const { body, status } = await appRequest.get(`${basePath}${categoryRoute.path}`).set('x-api-key', key).set('x-timestamp', timestamp);

      expect(status).toBe(200);
      expect(body.status).toBe(true);
      expect(body.data).toMatchObject(categoryData);
    });
  });
});
