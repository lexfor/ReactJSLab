export const FreeTimeSchema = {
  type: 'object',
  properties: {
    date: {
      type: 'string', pattern: '[0-9]{4}-[0-1]{0,1}[0-9]{1}-[0-3]{0,1}[0-9]{1}[A-Z][0-2]{1}[0-9]{1}:[0-5]{1}[0-9]{1}:[0-5]{1}[0-9]{1}.[0-9]{3}[A-Z]',
    },
  },
  required: ['date'],
  additionalProperties: true,
};
