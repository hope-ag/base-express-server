import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@/common/utils/HttpException';
import { logger } from '@common/utils/logger';

const errorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
  try {
    const status: number = error.status || 500;
    const message: string = error.message || 'somethingWentWrong';

    logger.error(
      `[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${req.t(message)}`
    );
    res.status(status).json({ message: req.t(message), success: false });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
