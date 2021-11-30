export const FreeTimeSchema = {
  type: 'object',
  properties: {
    date: {
      type: 'string', pattern: '[0-9]{4}-[0-1]{1}[0-9]{1}-[0-3]{1}[0-9]{1}[A-Z]{1}[0-2]{1}[0-9]{1}:[0-5]{1}[0-9]{1}:[0-5]{1}[0-9]{1}.[0-9]{3}[A-Z]', message: 'date should be same format yyyy-mm-dd[A-Z]hh:mm:ss',
    },
  },
  required: ['date'],
  additionalProperties: true,
};
