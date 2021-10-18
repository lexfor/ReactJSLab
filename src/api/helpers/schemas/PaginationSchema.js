export const PaginationSchema = {
  type: 'object',
  properties: {
    offset: {
      type: 'string',
    },
    count: {
      type: 'string',
    },
  },
  required: ['offset', 'count'],
  additionalProperties: true,
};
