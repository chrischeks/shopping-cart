import request from 'supertest';
import { createConnection, getRepository } from 'typeorm';
import App from '@/app';
import { dbConnection } from '@databases';
import { CreateUserDto } from '@dtos/user.dto';
import AuthRoute from '@routes/auth.route';
import IResponse from '@/interfaces/response.interface';
import CartRoute from '@/routes/cart.route';
import { CartDto } from '@/dtos/cart.dto';
import { Product } from '@/interfaces/product.interface';
import crypto from 'crypto';
import config from 'config';
const basePath = '/api/v1';

const baseData = {
  mobileNumber: '08100000000',
  password: 'q1w2e3r4!Q',
};

const userData: CreateUserDto = {
  ...baseData,
  firstName: 'test_firstname',
  lastName: 'test_lastname',
};

const cartRoute = new CartRoute();
const authRoute = new AuthRoute();
const app = new App([cartRoute, authRoute]);
const connection = createConnection(dbConnection);
const appRequest = request(app.getServer());
let bearerToken = '';
let userId = '';
const API_KEY = config.get('api_key');
const timestamp = `${Date.now()}`;
const text = `${API_KEY}|${timestamp}`;
const key = crypto.createHash('sha512', API_KEY).update(text).digest('hex');
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

describe('Testing Cart', () => {
  const productData: Product = {
    id: 'ae2c8e33-df9f-4a7f-8dd6-b6e096f10748',
    name: 'Test cloth 1',
    sku: 'cctecl01',
    description: 'This is a test product description.',
    sellingPrice: 10900,
    stockLevel: 90,
    categoryId: 'c9c0573f-c5e3-47aa-8040-3efb231c3d3f',
    imageURL: 'https://i.picsum.photos/id/7/200/300.jpg?hmac=_vgE8dZdzp3B8T1C9VrGrIMBkDOkFYbJNWqzJD47xNg',
    colours: ['gray', 'white', 'black'],
    sizes: ['sm', 'l', 'xl', 'm'],
  };
  const { stockLevel, name, id } = productData;
  const product = cartRoute.cartController.cartService.products;

  describe('[POST] /cart', () => {
    it('should successfully add a product to cart', async () => {
      const cartData: CartDto = {
        quantity: 10,
        productId: 'ae2c8e33-df9f-4a7f-8dd6-b6e096f10748',
        colour: 'white',
        size: 'l',
      };
      const productRepository = getRepository(product);
      productRepository.findOne = jest.fn().mockReturnValue(productData);

      return await appRequest
        .post(`${basePath}${cartRoute.path}/add-to-cart`)
        .set('x-api-key', key)
        .set('x-timestamp', timestamp)
        .set('Authorization', `Bearer ${bearerToken}`)
        .send(cartData)
        .then(result => {
          const { body, status } = result;
          expect(status).toBe(200);
          expect(body.message).toBe('Item added to cart successfully');
        });
    });

    it('should return precondition failed (412) when product does not have the specified colour', async () => {
      const cartData: CartDto = {
        quantity: 10,
        productId: 'ae2c8e33-df9f-4a7f-8dd6-b6e096f10748',
        colour: 'purple',
        size: 'l',
      };
      const productRepository = getRepository(product);
      productRepository.findOne = jest.fn().mockReturnValue(productData);

      return await appRequest
        .post(`${basePath}${cartRoute.path}/add-to-cart`)
        .set('x-api-key', key)
        .set('x-timestamp', timestamp)
        .set('Authorization', `Bearer ${bearerToken}`)
        .send(cartData)
        .then(result => {
          const { body, status } = result;
          expect(status).toBe(412);
          expect(body.message).toBe(`${productData.name} does not have ${cartData.colour} colour`);
        });
    });

    it('should return precondition failed (412) when product does not have the specified size', async () => {
      const cartData: CartDto = {
        quantity: 10,
        productId: 'ae2c8e33-df9f-4a7f-8dd6-b6e096f10748',
        colour: 'white',
        size: 'xxl',
      };
      const productRepository = getRepository(product);
      productRepository.findOne = jest.fn().mockReturnValue(productData);

      return await appRequest
        .post(`${basePath}${cartRoute.path}/add-to-cart`)
        .set('x-api-key', key)
        .set('x-timestamp', timestamp)
        .set('Authorization', `Bearer ${bearerToken}`)
        .send(cartData)
        .then(result => {
          const { body, status } = result;
          expect(status).toBe(412);
          expect(body.message).toBe(`${name} does not have ${cartData.size} size`);
        });
    });

    it('should return precondition failed (412) if the cart quantity is greater than the stock level ', async () => {
      const cartData: CartDto = {
        quantity: 1000,
        productId: 'ae2c8e33-df9f-4a7f-8dd6-b6e096f10748',
        colour: 'white',
        size: 'l',
      };
      const productRepository = getRepository(product);
      productRepository.findOne = jest.fn().mockReturnValue(productData);

      return await appRequest
        .post(`${basePath}${cartRoute.path}/add-to-cart`)
        .set('x-api-key', key)
        .set('x-timestamp', timestamp)
        .set('Authorization', `Bearer ${bearerToken}`)
        .send(cartData)
        .then(result => {
          const { body, status } = result;
          expect(status).toBe(412);
          expect(body.message).toBe(`Only ${stockLevel} remaining.`);
        });
    });

    it('should return failed validation (400) if size is omitted ', async () => {
      const cartData = {
        quantity: 10,
        productId: 'ae2c8e33-df9f-4a7f-8dd6-b6e096f10748',
        colour: 'white',
      };
      const productRepository = getRepository(product);
      productRepository.findOne = jest.fn().mockReturnValue(productData);

      return await appRequest
        .post(`${basePath}${cartRoute.path}/add-to-cart`)
        .set('x-api-key', key)
        .set('x-timestamp', timestamp)
        .set('Authorization', `Bearer ${bearerToken}`)
        .send(cartData)
        .then(result => {
          const { body, status } = result;
          expect(status).toBe(400);
          expect(body.message).toBe(`size must be a string,size should not be empty`);
        });
    });

    it('should return failed validation (400) if colour omitted ', async () => {
      const cartData = {
        quantity: 10,
        productId: 'ae2c8e33-df9f-4a7f-8dd6-b6e096f10748',
        size: 'l',
      };
      const productRepository = getRepository(product);
      productRepository.findOne = jest.fn().mockReturnValue(productData);

      return await appRequest
        .post(`${basePath}${cartRoute.path}/add-to-cart`)
        .set('x-api-key', key)
        .set('x-timestamp', timestamp)
        .set('Authorization', `Bearer ${bearerToken}`)
        .send(cartData)
        .then(result => {
          const { body, status } = result;
          expect(status).toBe(400);
          expect(body.message).toBe(`colour must be a string,colour should not be empty`);
        });
    });
  });

  describe('[PUT] /update-cart', () => {
    it('should successfully update cart', async () => {
      const cartData = {
        quantity: 20,
        productId: 'ae2c8e33-df9f-4a7f-8dd6-b6e096f10748',
        colour: 'white',
        size: 'm',
      };
      const productRepository = getRepository(product);
      productRepository.findOne = jest.fn().mockReturnValue(productData);

      return await appRequest
        .put(`${basePath}${cartRoute.path}/update-cart`)
        .set('x-api-key', key)
        .set('x-timestamp', timestamp)
        .set('Authorization', `Bearer ${bearerToken}`)
        .send(cartData)
        .then(result => {
          const { body, status } = result;
          expect(status).toBe(200);
          expect(body.message).toBe('Item updated successfully');
        });
    });

    it('should return precondition failed (412) when product does not have the specified colour', async () => {
      const cartData = {
        productId: 'ae2c8e33-df9f-4a7f-8dd6-b6e096f10748',
        colour: 'blue',
      };
      const productRepository = getRepository(product);
      productRepository.findOne = jest.fn().mockReturnValue(productData);

      return await appRequest
        .put(`${basePath}${cartRoute.path}/update-cart`)
        .set('x-api-key', key)
        .set('x-timestamp', timestamp)
        .set('Authorization', `Bearer ${bearerToken}`)
        .send(cartData)
        .then(result => {
          const { body, status } = result;
          expect(status).toBe(412);
          expect(body.message).toBe(`${productData.name} does not have ${cartData.colour} colour`);
        });
    });

    it('should return precondition failed (412) when product does not have the specified size', async () => {
      const cartData = {
        productId: 'ae2c8e33-df9f-4a7f-8dd6-b6e096f10748',
        size: 'xxl',
      };
      const productRepository = getRepository(product);
      productRepository.findOne = jest.fn().mockReturnValue(productData);

      return await appRequest
        .put(`${basePath}${cartRoute.path}/update-cart`)
        .set('x-api-key', key)
        .set('x-timestamp', timestamp)
        .set('Authorization', `Bearer ${bearerToken}`)
        .send(cartData)
        .then(result => {
          const { body, status } = result;
          expect(status).toBe(412);
          expect(body.message).toBe(`${name} does not have ${cartData.size} size`);
        });
    });
  });

  describe('[DELETE] /update-cart', () => {
    it('should successfully remove an item from cart', async () => {
      const productRepository = getRepository(product);
      productRepository.findOne = jest.fn().mockReturnValue(productData);

      return await appRequest
        .delete(`${basePath}${cartRoute.path}/remove-item/${id}`)
        .set('x-api-key', key)
        .set('x-timestamp', timestamp)
        .set('Authorization', `Bearer ${bearerToken}`)
        .then(result => {
          const { body, status } = result;
          expect(status).toBe(200);
          expect(body.message).toBe('Item removed from cart successfully');
        });
    });
  });

  describe('[GET] /update-cart', () => {
    it('should successfully list items in a cart', async () => {
      const productRepository = getRepository(product);
      productRepository.findOne = jest.fn().mockReturnValue(productData);

      return await appRequest
        .get(`${basePath}${cartRoute.path}`)
        .set('x-api-key', key)
        .set('x-timestamp', timestamp)
        .set('Authorization', `Bearer ${bearerToken}`)
        .then(result => {
          const { body, status } = result;
          expect(status).toBe(200);
          expect(body.message).toBe('Cart retrieved successfully');
        });
    });
  });
});
