import bcrypt from 'bcrypt';
import { UserEntity } from '@/entities/user.entity';
import UniversalService from './universal.service';
import IResponse from '@/interfaces/response.interface';
import { getRepository } from 'typeorm';
import { User } from '@/interfaces/user.interface';
import Status from '@/enums/status.enum';

class UserService extends UniversalService {
  public users = UserEntity;

  public async findAllUsers(query): Promise<IResponse> {
    const take = query.take || 10;
    const skip = query.skip || 0;
    const userRepository = getRepository(this.users);
    const findUser: User[] = await userRepository.find({ order: { createdAt: 'DESC' }, take, skip });
    return this.successResponse('success', findUser, Status.SUCCESS);
  }
}

export default UserService;
