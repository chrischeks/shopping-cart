import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { CreateUserDto } from '@dtos/user.dto';
import { UserEntity } from '@/entities/user.entity';
import { User } from '@interfaces/user.interface';
import UniversalService from '@/services/universal.service';
import Status from '@/enums/status.enum';
import { AuthDto } from '@/dtos/auth.dto';
import config from 'config';
import { DataStoredInToken, TokenData } from '@/interfaces/auth.interface';

class AuthService extends UniversalService {
  public users = UserEntity;

  public async signup(userData: CreateUserDto) {
    const userRepository = getRepository(this.users);
    const foundUser: User = await userRepository.findOne({ where: { mobileNumber: userData.mobileNumber } });
    if (foundUser) return this.failureResponse(Status.CONFLICT, `User already exists`);
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const createUserData: User = await userRepository.save({
      ...userData,
      password: hashedPassword,
    });
    delete createUserData.password;
    return this.successResponse('User created successfully', createUserData, Status.CREATED);
  }

  public async login(userData: AuthDto) {
    const userRepository = getRepository(this.users);
    const { mobileNumber, password } = userData;
    const foundUser: User = await userRepository.findOne({ where: { mobileNumber } });
    if (!foundUser) return this.failureResponse(Status.FAILED_VALIDATION, 'Invalid mobile number or password');

    const isPasswordMatching: boolean = await bcrypt.compare(password, foundUser.password);
    if (!isPasswordMatching) return this.failureResponse(Status.FAILED_VALIDATION, 'Invalid mobile number or password');

    const tokenData = await this.createToken(foundUser);
    const cookie = this.createCookie(tokenData);
    return this.successResponse('Login successful', { cookie, foundUser });
  }

  public async createToken(user: User): Promise<TokenData> {
    const dataStoredInToken: DataStoredInToken = { id: user.id };
    const secretKey: string = config.get('secretKey');
    const expiresIn: string = '1d';

    return { expiresIn, token: jwt.sign(dataStoredInToken, secretKey, { expiresIn }) };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }
}

export default AuthService;
