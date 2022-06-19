import { Request, Response } from 'express';
import { isString } from 'lodash';

export const sendSuccessResponse = (req: Request, res: Response, data: any, status = 200) => {
  const success = true;
  res.status(status).json({ data: isString(data) ? req.t(data) : data, success });
};
