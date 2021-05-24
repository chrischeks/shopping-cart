import request from 'supertest';
import { createConnection, getRepository } from 'typeorm';
import App from '@/app';
import { dbConnection } from '@databases';
import { CategoryDto } from '@/dtos/category.dto';
import CategoryRoute from '@/routes/category.route';
import crypto from 'crypto';
import config from 'config';
import AuthRoute from '@/routes/auth.route';
import { CreateUserDto } from '@/dtos/user.dto';
import IResponse from '@/interfaces/response.interface';
import { NextFunction, Response, Request, response } from 'express';
import { RequestWithUser } from '@/interfaces/auth.interface';
import * as admin from '@/middlewares/admin.middleware';
const basePath = '/api/v1';

const baseData = {
  mobileNumber: '08100000001',
  password: 'q1w2e3r4!Y',
};

const userData: CreateUserDto = {
  ...baseData,
  firstName: 'test_firstname',
  lastName: 'test_lastname',
};
jest.spyOn(admin, 'isAdmin').mockImplementation((req: RequestWithUser, res: Response, next: NextFunction) => Promise.resolve(next()));

const API_KEY = config.get('api_key');
const timestamp = `${Date.now()}`;
const text = `${API_KEY}|${timestamp}`;
const key = crypto.createHash('sha512', API_KEY).update(text).digest('hex');
const authRoute = new AuthRoute();
const categoryRoute = new CategoryRoute();
let bearerToken = '';
let userId = '';
const app = new App([categoryRoute, authRoute]);
const connection = createConnection(dbConnection);
const appRequest = request(app.getServer());
beforeAll(async () => {
  await connection;
  await appRequest
    .post(`${basePath}${authRoute.path}/signup`)
    .set('x-api-key', key)
    .set('x-timestamp', timestamp)
    .send(userData)
    .then(result => {
      expect(result.status).toBe(201);
    });

  await appRequest
    .post(`${basePath}${authRoute.path}/login`)
    .set('x-api-key', key)
    .set('x-timestamp', timestamp)
    .send(baseData)
    .then(result => {
      const { body, status } = result;
      const { data } = body as IResponse;
      bearerToken = data.cookie.split('Authorization=')[1].split(';')[0];
      userId = data.id;
      expect(status).toBe(200);
    });
});

afterAll(async () => {
  (await connection).getRepository('Users').delete(() => '');
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

      // jest.spyOn(admin, 'isAdmin').mockImplementation((req: RequestWithUser, res: Response, next: NextFunction) => Promise.resolve(next()));
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
        .set('Authorization', `Bearer ${bearerToken}`)
        .send(categoryData);
      expect(status).toBe(201);
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
      const { body, status } = await appRequest
        .get(`${basePath}${categoryRoute.path}`)
        .set('x-api-key', key)
        .set('x-timestamp', timestamp)
        .set('Authorization', `Bearer ${bearerToken}`);
      expect(status).toBe(200);
      expect(body.status).toBe(true);
      expect(body.data).toMatchObject(categoryData);
    });
  });
});
