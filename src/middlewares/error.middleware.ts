import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@/common/core/HttpException';
import { logger } from '@/common/core/logger';

const errorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
  try {
    const status: number = error.status || 500;
    const message: string = error.message || 'errorMessages.somethingWentWrong';
    logger.error(error);

    logger.error(
      `[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${req.t(message)}`
    );
    res.status(status).json({ message: req.t(message), success: false });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
