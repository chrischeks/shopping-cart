import bcrypt from 'bcrypt';
import request from 'supertest';
import { createConnection, getRepository } from 'typeorm';
import App from '@/app';
import { dbConnection } from '@databases';
import { CreateUserDto } from '@dtos/user.dto';
import AuthRoute from '@routes/auth.route';
import { AuthDto } from '@/dtos/auth.dto';
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

describe('Testing Auth', () => {
  const baseData = {
    mobileNumber: '08100000000',
    password: 'q1w2e3r4!Q',
  };
  const date = new Date();
  describe('[POST] /signup', () => {
    it('response should have the Create userData', async () => {
      const userData: CreateUserDto = {
        ...baseData,
        firstName: 'test_firstname',
        lastName: 'test_lastname',
      };
      const { mobileNumber, firstName, lastName } = userData;
      const authRoute = new AuthRoute();
      const users = authRoute.authController.authService.users;
      const userRepository = getRepository(users);

      userRepository.findOne = jest.fn().mockReturnValue(null);
      userRepository.save = jest.fn().mockReturnValue({
        id: 1,
        mobileNumber,
        firstName,
        lastName,
        role: 'user',
      });

      const app = new App([authRoute]);
      const { body, status } = await request(app.getServer())
        .post(`${basePath}${authRoute.path}/signup`)
        .set('x-api-key', key)
        .set('x-timestamp', timestamp)
        .send(userData);
      expect(status).toBe(201);
      expect(body).toEqual({
        data: { id: 1, mobileNumber: '08100000000', firstName, lastName, role: 'user' },
        message: 'User created successfully',
        status: true,
      });
    });

    it('should return an error message for required fields with empty string', async () => {
      const userData: CreateUserDto = {
        mobileNumber: '0810000000',
        password: 'q1w2e3r4!',
        firstName: '',
        lastName: '',
      };
      const authRoute = new AuthRoute();
      const users = authRoute.authController.authService.users;
      const userRepository = getRepository(users);

      userRepository.findOne = jest.fn().mockReturnValue(null);

      const app = new App([authRoute]);
      const { body, status } = await request(app.getServer())
        .post(`${basePath}${authRoute.path}/signup`)
        .set('x-api-key', key)
        .set('x-timestamp', timestamp)
        .send(userData);
      expect(status).toBe(400);
      expect(body).toEqual({
        message:
          'Enter a password at least 8 characters long which contains at least one lowercase letter, one uppercase letter, one numeric digit, and one special character, firstName should not be empty, lastName should not be empty, 11-digit mobile number is required',
        status: false,
      });
    });
  });

  describe('[POST] /login', () => {
    it('response should have the Set-Cookie header with the Authorization token', async () => {
      const { mobileNumber, password } = baseData;
      const mockFindOne = {
        mobileNumber,
        role: 'user',
        createdAt: date.toISOString(),
        updatedAt: date.toISOString(),
        id: '8125ff1e-8783-4629-80ea-43fcbe408136',
        password: await bcrypt.hash(password, 10),
      };
      const userData: AuthDto = {
        ...baseData,
      };

      const authRoute = new AuthRoute();
      const users = authRoute.authController.authService.users;
      const cookie = authRoute.authController.authService;
      const userRepository = getRepository(users);

      userRepository.findOne = jest.fn().mockReturnValue(mockFindOne);
      cookie.createCookie = jest
        .fn()
        .mockReturnValue(
          'Authorization=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjgxMjVmZjFlLTg3ODMtNDYyOS04MGVhLTQzZmNiZTQwODEzNiIsImlhdCI6MTYyMTA4Mjg5NywiZXhwIjoxNjIxMDg2NDk3fQ.Z3dl70B3B3Py85rKKH_2rYFDl2m0xPp_Yi1WdlfHNew; HttpOnly; Max-Age=3600;',
        );

      const app = new App([authRoute]);

      const { body } = await request(app.getServer())
        .post(`${basePath}${authRoute.path}/login`)
        .set('x-api-key', key)
        .set('x-timestamp', timestamp)
        .send(userData)
        .expect(200)
        .expect('Set-Cookie', /^Authorization=.+/);
      expect(body).toHaveProperty('data.cookie');

      expect(body).toEqual({
        status: true,
        message: 'Login successful',
        data: {
          cookie:
            'Authorization=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjgxMjVmZjFlLTg3ODMtNDYyOS04MGVhLTQzZmNiZTQwODEzNiIsImlhdCI6MTYyMTA4Mjg5NywiZXhwIjoxNjIxMDg2NDk3fQ.Z3dl70B3B3Py85rKKH_2rYFDl2m0xPp_Yi1WdlfHNew; HttpOnly; Max-Age=3600;',
          foundUser: { ...mockFindOne },
        },
      });
    });
  });
});
