import Status from '@/enums/status.enum';
import IResponse from '@/interfaces/response.interface';
import { logger } from '@utils/logger';

class UniversalService {
  public successResponse = async (message = 'success', data = null, statusNumber = 0): Promise<IResponse> => {
    const statusString = Status[statusNumber];
    const statusCode = await this.getHttpStatus(statusString);
    logger.info(`StatusCode : ${statusCode}, Message : ${message}`);
    return { statusCode, status: true, message, data };
  };

  public failureResponse = async (statusNumber: number, message = 'failed', data = null): Promise<IResponse> => {
    const statusString = Status[statusNumber];
    const statusCode = await this.getHttpStatus(statusString);
    logger.warn(`StatusCode : ${statusCode}, Message : ${message}`);
    return { statusCode, status: false, message, data };
  };

  private async getHttpStatus(statusString: string): Promise<number> {
    const status = {
      SUCCESS: 200,
      CREATED: 201,
      FAILED_VALIDATION: 400,
      ERROR: 500,
      NOT_FOUND: 404,
      PRECONDITION_FAILED: 412,
      SUCCESS_NO_CONTENT: 204,
      FORBIDDEN: 403,
      CONFLICT: 409,
      UNAUTHORIZED: 401,
    };
    return status[statusString];
  }
}
export default UniversalService;
