export const FreeTimeSchema = {
  type: 'object',
  properties: {
    date: {
      type: 'string',
    },
  },
  required: ['date'],
  additionalProperties: true,
};
