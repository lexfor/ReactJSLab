import { MAX_LENGTH, MIN_LENGTH } from '../../../constants';

export const CreateAppointmentSchema = {
  type: 'object',
  properties: {
    date: {
      type: 'string', pattern: '[0-9]{4}-[0-1]{1}[0-9]{1}-[0-3]{1}[0-9]{1}[A-Z]{1}[0-2]{1}[0-9]{1}:[0-5]{1}[0-9]{1}:[0-5]{1}[0-9]{1}.[0-9]{3}[A-Z]'
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
