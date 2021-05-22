import config from 'config';
import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { UserEntity } from '@/entities/user.entity';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
import UniversalController from '@/controllers/universal.controller';

const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
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
        await controller.controllerResponseHandler({ message: 'Wrong authentication token.', status: false, statusCode: 401 }, req, res);
      }
    } else {
      await controller.controllerResponseHandler({ message: 'Authentication token missing.', status: false, statusCode: 401 }, req, res);
    }
  } catch (error) {
    await controller.controllerResponseHandler({ message: 'Wrong/expired authentication token.', status: false, statusCode: 401 }, req, res);
  }
};

export default authMiddleware;
