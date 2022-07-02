import { User } from '@/interfaces/users.interface';
import joi from 'joi';
import passwordComplexity from 'joi-password-complexity';

export const registrationSchema = joi.object<User>({
  email: joi.string().email().required(),
  password: passwordComplexity().required()
});

export const loginSchema = joi.object<User>({
  email: joi.string().required(),
  password: joi.string().required()
});
