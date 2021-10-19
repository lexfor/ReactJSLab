import { MAX_LENGTH, MIN_LENGTH } from '../../../constants';

export const CreateResolutionSchema = {
  type: 'object',
  properties: {
    resolution: {
      type: 'string', maxLength: MAX_LENGTH, minLength: MIN_LENGTH,
    },
    appointmentID: {
      type: 'string',
    },
  },
  required: ['resolution', 'appointmentID'],
  additionalProperties: false,
};
