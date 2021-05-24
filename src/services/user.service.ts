import bcrypt from 'bcrypt';
import { UserEntity } from '@/entities/user.entity';
import UniversalService from './universal.service';
import IResponse from '@/interfaces/response.interface';
import { getRepository } from 'typeorm';
import { User } from '@/interfaces/user.interface';
import Status from '@/enums/status.enum';
import { PaginationDto } from '@/dtos/pagination.dto';

class UserService extends UniversalService {
  public users = UserEntity;

  public async findAllUsers(query: PaginationDto): Promise<IResponse> {
    const { take = 10, skip = 0 } = query;
    const userRepository = getRepository(this.users);
    const findUser: User[] = await userRepository.find({ order: { createdAt: 'DESC' }, take, skip });
    return this.successResponse('success', findUser, Status.SUCCESS);
  }
}

export default UserService;
