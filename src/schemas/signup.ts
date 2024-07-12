import Joi, { ObjectSchema } from 'joi';

const signUpSchema: ObjectSchema = Joi.object().keys({
  username: Joi.string().min(4).max(12).required().messages({
    'string.base': 'Username must be of type string',
    'string.min': 'Invalid username',
    'string.max': 'Invalid username',
    'string.empty': 'Username is required field'
  }),
  password: Joi.string().alphanum().min(4).required().messages({
    'string.base': 'Password must be of type of alpha numeric',
    'string.min': 'Invalid password',
    'string.empty': 'Password is required field'
  }),
  country: Joi.string().required().messages({
    'string.base': 'Country must be of type string',
    'string.empty': 'Country is required field'
  }),
  email: Joi.string().email().required().messages({
    'string.base': 'Email must be of type string',
    'string.email': 'Invalid email',
    'string.empty': 'Email is required field'
  }),
  profilePicture: Joi.string().required().messages({
    'string.base': 'Please add a profile picture',
    'string.email': 'profile picture is required',
    'string.empty': 'profile picture is required'
  })
});

export { signUpSchema };
