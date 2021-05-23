import config from 'config';
import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { UserEntity } from '@/entities/user.entity';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
import UniversalController from '@/controllers/universal.controller';

const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const auth = { status: false, statusCode: 401 };
  const controller = new UniversalController();
  try {
    const Authorization = req.cookies['Authorization'] || req.header('Authorization')?.split('Bearer ')[1] || null;
    if (Authorization) {
      const secretKey: string = config.get('secretKey');
      const verificationResponse = (await jwt.verify(Authorization, secretKey)) as DataStoredInToken;
      const userId = verificationResponse.id;

      const userRepository = getRepository(UserEntity);
      const foundUser = await userRepository.findOne(userId, { select: ['id', 'firstName', 'lastName'] });
      if (foundUser) {
        req.user = foundUser;
        next();
      } else {
        await controller.controllerResponseHandler({ ...auth, message: 'Wrong authentication token.' }, req, res);
      }
    } else {
      await controller.controllerResponseHandler({ ...auth, message: 'Authentication token missing.' }, req, res);
    }
  } catch (error) {
    await controller.controllerResponseHandler({ ...auth, message: 'Wrong/expired authentication token.' }, req, res);
  }
};

export default authMiddleware;
