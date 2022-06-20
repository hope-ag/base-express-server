import { Request, Response } from 'express';

export const sendSuccessResponse = (req: Request, res: Response, data: any, status = 200) => {
  const success = true;
  res.status(status).json({ data: translateData(data, req), success });
};

function translateData(data: any, req: Request) {
  if (data && typeof data === 'object' && data.message && typeof data.message === 'string') {
    return { ...data, message: req.t(data.message) };
  }
  if (data && typeof data === 'string') {
    return req.t(data);
  }
  return data;
}
