import { MAX_LENGTH, MIN_LENGTH } from '../../../constants';

export const UserSchema = {
  type: 'object',
  properties: {
    userName: {
      type: 'string', maxLength: MAX_LENGTH, minLength: MIN_LENGTH, pattern: '([0-9A-Za-z]+)@([a-z]+).([a-z]+)',
    },
    password: {
      type: 'string', maxLength: MAX_LENGTH, minLength: MIN_LENGTH, pattern: '[a-zA-Z0-9]+',
    },
    firstName: {
      type: 'string', maxLength: MAX_LENGTH, minLength: MIN_LENGTH, pattern: '[a-zA-Z]+',
    },
    lastName: {
      type: 'string', maxLength: MAX_LENGTH, minLength: MIN_LENGTH, pattern: '[a-zA-Z]+',
    },
  },
  required: ['login', 'password', 'firstName', 'lastName'],
  additionalProperties: false,
};
