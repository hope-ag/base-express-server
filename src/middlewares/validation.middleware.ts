import { RequestHandler } from 'express';
import { UnprocessableEntity } from 'http-errors';
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
      next(new UnprocessableEntity(error.message));
    }
  };
};

export default validationMiddleware;
