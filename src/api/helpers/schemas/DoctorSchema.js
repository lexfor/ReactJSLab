import { MAX_LENGTH, MIN_LENGTH } from '../../../constants';

export const DoctorSchema = {
  type: 'object',
  properties: {
    userName: {
      type: 'string', maxLength: MAX_LENGTH, minLength: MIN_LENGTH, pattern: '([0-9A-Za-z]+)@([a-z]+).([a-z]+)', message: 'userName should be a mail',
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
    specializations: {
      type: 'array'
    },
  },
  required: ['userName', 'password', 'firstName', 'lastName', 'specializations'],
  additionalProperties: false,
};
