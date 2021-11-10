import {MIN_LENGTH} from "../../../constants";

export const IDSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string', minLength: MIN_LENGTH
    },
  },
  required: ['id'],
  additionalProperties: false,
};
