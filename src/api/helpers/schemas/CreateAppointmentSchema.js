import { MAX_LENGTH, MIN_LENGTH } from '../../../constants';

export const CreateAppointmentSchema = {
  type: 'object',
  properties: {
    date: {
      type: 'string',
    },
    reason: {
      type: 'string', maxLength: MAX_LENGTH, minLength: MIN_LENGTH,
    },
    doctorID: {
      type: 'string',
    },
  },
  required: ['date', 'reason', 'doctorID'],
  additionalProperties: true,
};
