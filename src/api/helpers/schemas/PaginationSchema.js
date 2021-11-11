export const PaginationSchema = {
  type: 'object',
  properties: {
    offset: {
      type: 'string',
    },
    limit: {
      type: 'string',
    },
  },
  required: ['offset', 'count'],
  additionalProperties: true,
};
