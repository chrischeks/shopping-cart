import { getRepository } from 'typeorm';
import UniversalService from './universal.service';
import Status from '@/enums/status.enum';
import { CartDto } from '@/dtos/cart.dto';
import { ProductEntity } from '@/entities/product.entity';
import { Product } from '@/interfaces/product.interface';
import * as redis from 'redis';
import { Cart } from '@/interfaces/cart.interface';

const client = redis.createClient();

class CartService extends UniversalService {
  public products = ProductEntity;

  private baseCartCheck = async (productId: string, size?: string, colour?: string) => {
    const productRepository = getRepository(this.products);
    const foundProduct: Product = await productRepository.findOne(productId);
    if (!foundProduct) return this.failureResponse(Status.PRECONDITION_FAILED, `Product with id :${productId} was not found`);
    const { sizes, colours, name } = foundProduct;
    if (size && !sizes.includes(size)) return this.failureResponse(Status.PRECONDITION_FAILED, `${name} does not have ${size} size`);
    if (colour && !colours.includes(colour)) return this.failureResponse(Status.PRECONDITION_FAILED, `${name} does not have ${colour} colour`);
    return this.successResponse('success', foundProduct);
  };

  public addItemToCart = async (cartData: CartDto, userId: string) => {
    const { quantity, colour, size, productId } = cartData;
    const checkPassed = await this.baseCartCheck(productId, size, colour);
    const { data, status } = checkPassed;
    if (status === false) return checkPassed;
    const { name, stockLevel, sellingPrice } = data as Product;
    if (stockLevel < quantity) return this.failureResponse(Status.PRECONDITION_FAILED, `Only ${stockLevel} remaining.`);
    let userCart: Cart[] | null = await this.getUserCart(userId);
    if (!userCart) {
      await this.setUserCart(userId, [{ ...cartData, name, sellingPrice, totalPrice: sellingPrice * quantity, colour, size, userId }]);
      return this.successResponse('Item added to cart successfully');
    }
    const foundProduct = userCart.find(item => item.productId == productId);
    if (foundProduct) return this.failureResponse(Status.PRECONDITION_FAILED, 'Product already exists in cart');
    userCart.push({ ...cartData, sellingPrice, totalPrice: quantity * sellingPrice, name, userId });
    await this.setUserCart(userId, userCart);
    return this.successResponse('Item added to cart successfully');
  };

  private getUserCart = async (uniqueKey: string): Promise<Cart[] | null> => {
    return new Promise((resolve, reject) => {
      client.get(uniqueKey, async (error, cart) => {
        if (error) reject(error);
        resolve(JSON.parse(cart));
      });
    });
  };

  private setUserCart = async (uniqueKey: string, value: Cart[]): Promise<string> => {
    return new Promise((resolve, reject) => {
      client.set(uniqueKey, JSON.stringify(value), async (error, cart) => {
        if (error) reject(error);
        resolve(cart);
      });
    });
  };
}

export default CartService;
