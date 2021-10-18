import { MAX_LENGTH, MIN_LENGTH } from '../../../constants';

export const ChangePasswordSchema = {
  type: 'object',
  properties: {
    oldPassword: {
      type: 'string', maxLength: MAX_LENGTH, minLength: MIN_LENGTH,
    },
    newPassword: {
      type: 'string', maxLength: MAX_LENGTH, minLength: MIN_LENGTH,
    },
  },
  required: ['oldPassword', 'newPassword'],
  additionalProperties: false,
};
