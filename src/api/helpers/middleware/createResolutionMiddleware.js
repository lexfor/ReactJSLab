import Ajv from 'ajv';
import { StatusCodes } from 'http-status-codes';
import { NOT_AVAILABLE } from '../../../constants';
import { CreateResolutionSchema } from '../schemas/CreateResolutionSchema';

const ajv = new Ajv();

function createResolutionMiddleware(req, res, next) {
  const validationResult = ajv.validate(CreateResolutionSchema, req.body);
  if (!validationResult) {
    res.status(StatusCodes.BAD_REQUEST).json(NOT_AVAILABLE);
  } else {
    next();
  }
}

export { createResolutionMiddleware };
