import { NextFunction, Request, Response } from 'express';
import crypto from 'crypto';
import UniversalController from '@/controllers/universal.controller';
import config from 'config';

const verifyKey = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const invalidAuth = { message: 'Invalid authentication..', status: false, statusCode: 401 };
  const controller = new UniversalController();

  const key = req.headers['x-api-key'];
  const headerTimestamp = Number(req.headers['x-timestamp']);

  if (!key || !headerTimestamp) {
    return await controller.controllerResponseHandler(invalidAuth, req, res);
  }
  const API_KEY = config.get('api_key');

  const text = `${API_KEY}|${headerTimestamp}`;
  const hash = crypto.createHash('sha512', API_KEY).update(text).digest('hex');
  const timeDiff = Date.now() - headerTimestamp;
  if (hash !== key || timeDiff > 300000) {
    return await controller.controllerResponseHandler(invalidAuth, req, res);
  }
  next();
};

export default verifyKey;
