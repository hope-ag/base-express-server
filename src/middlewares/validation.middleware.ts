import { RequestHandler } from 'express';
import { ObjectSchema } from 'joi';

const validationMiddleware = (
  schema: ObjectSchema,
  path: 'body' | 'query' | 'params' | 'headers' = 'body'
): RequestHandler => {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req[path], { abortEarly: true });
      next();
    } catch (error) {
      throw new Error(error);
    }
  };
};

export default validationMiddleware;
