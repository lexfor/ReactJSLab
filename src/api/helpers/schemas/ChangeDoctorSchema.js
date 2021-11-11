import { MAX_LENGTH, MIN_LENGTH } from '../../../constants';

export const ChangeDoctorSchema = {
  type: 'object',
  properties: {
    firstName: {
      type: 'string', maxLength: MAX_LENGTH, minLength: MIN_LENGTH,
    },
    lastName: {
      type: 'string', maxLength: MAX_LENGTH, minLength: MIN_LENGTH,
    }
  },
  required: ['firstName', 'lastName'],
  additionalProperties: true,
};
