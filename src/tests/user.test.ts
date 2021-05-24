import request from 'supertest';
import { createConnection } from 'typeorm';
import App from '@/app';
import { dbConnection } from '@databases';
import { CreateUserDto } from '@dtos/user.dto';
import AuthRoute from '@routes/auth.route';
import UsersRoute from '@/routes/user.route';
import IResponse from '@/interfaces/response.interface';
import crypto from 'crypto';
import config from 'config';
const basePath = '/api/v1';

const API_KEY = config.get('api_key');
const timestamp = `${Date.now()}`;
const text = `${API_KEY}|${timestamp}`;
const key = crypto.createHash('sha512', API_KEY).update(text).digest('hex');
const connection = createConnection(dbConnection);
beforeAll(async () => {
  await connection;
  (await connection).getRepository('Users').delete(() => '');
});

afterAll(async () => {
  (await connection).getRepository('Users').delete(() => '');
  //   await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing User', () => {
  const baseData = {
    mobileNumber: '08100000002',
    password: 'q1w2e3r4!L',
  };
  const date = new Date();
  describe('[GET] /user', () => {
    it('should return details of a logged in user', async () => {
      const userData: CreateUserDto = {
        ...baseData,
        firstName: 'test_firstname',
        lastName: 'test_lastname',
      };
      const { firstName, lastName } = userData;
      const authRoute = new AuthRoute();
      const userRoute = new UsersRoute();

      const app = new App([authRoute, userRoute]);
      let bearerToken: string = '';
      const appRequest = request(app.getServer());
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
          expect(status).toBe(200);
        });

      return await appRequest
        .get(`${basePath}${userRoute.userPath}`)
        .set('x-api-key', key)
        .set('x-timestamp', timestamp)
        .set('Authorization', `Bearer ${bearerToken}`)
        .send(baseData)
        .then(result => {
          const { body, status } = result;
          const { data, status: bodyStatus } = body as IResponse;
          const { firstName: resultFirstName, lastName: resultLastName, id } = data;
          expect(status).toBe(200);
          expect(bodyStatus).toBe(true);
          expect(id).not.toBeUndefined();
          expect(resultFirstName).toBe(firstName);
          expect(resultLastName).toBe(lastName);
        });
    });
  });
});
