import bcrypt from 'bcrypt';
import { getRepository } from 'typeorm';
import { CreateUserDto } from '@dtos/user.dto';
import { UserEntity } from '@/entities/user.entity';
import { User } from '@interfaces/user.interface';
import UniversalService from '@/services/universal.service';
import Status from '@/enums/status.enum';

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
}

export default AuthService;
