import joi from 'joi';
import passwordComplexity from 'joi-password-complexity';

export const registrationSchema = joi.object({
  email: joi.string().email().required(),
  password: passwordComplexity().required()
});
