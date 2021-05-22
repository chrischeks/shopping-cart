import bcrypt from 'bcrypt';
import { UserEntity } from '@/entities/user.entity';
import UniversalService from './universal.service';

class UserService extends UniversalService {
  public users = UserEntity;
}

export default UserService;
