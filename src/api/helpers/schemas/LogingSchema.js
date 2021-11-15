import { MAX_LENGTH, MIN_LENGTH } from '../../../constants';

export const LogingSchema = {
  type: 'object',
  properties: {
    userName: {
      type: 'string', maxLength: MAX_LENGTH, minLength: MIN_LENGTH, pattern: '([0-9A-Za-z]+)@([a-z]+).([a-z]+)', message: 'user name should be a mail',
    },
    password: {
      type: 'string', maxLength: MAX_LENGTH, minLength: MIN_LENGTH, pattern: '[a-zA-Z0-9]+',
    },
  },
  required: ['userName', 'password'],
  additionalProperties: false,
};
