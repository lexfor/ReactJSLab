import Ajv from 'ajv';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../ApiError';
import { ajvParseErrorLog } from '../ajvParseErrorLog';

const ajv = new Ajv();

export function ajvValidator(data, schema, req, res, next) {
  const validateEnqueueSchema = ajv.compile(schema);
  const valid = validateEnqueueSchema(data);

  if (!valid) {
    const validationErrors = ajvParseErrorLog(
      validateEnqueueSchema.errors[0],
    );
    throw new ApiError(validationErrors, StatusCodes.BAD_REQUEST);
  }
  next();
};
