import Joi, { ObjectSchema } from 'joi';

const signInSchema: ObjectSchema = Joi.object().keys({
  username: Joi.alternatives().conditional(Joi.string().email(), {
    then: Joi.string().email().required().messages({
      'string.base': 'Email must be of type string',
      'string.email': 'Invalid email',
      'string.empty': 'Email is required field'
    }),
    otherwise: Joi.string().min(4).max(12).required().messages({
      'string.base': 'Username must be of type string',
      'string.min': 'Invalid username',
      'string.max': 'Invalid username',
      'string.empty': 'Username is required field'
    })
  }),
  password: Joi.string().alphanum().min(4).required().messages({
    'string.base': 'Password must be of type of alpha numeric',
    'string.min': 'Invalid password',
    'string.empty': 'Password is required field'
  })
});

export { signInSchema };
