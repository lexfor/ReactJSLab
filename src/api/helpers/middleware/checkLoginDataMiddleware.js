import Ajv from 'ajv';
import { StatusCodes } from 'http-status-codes';
import { LogingSchema } from '../schemas/LogingSchema';
import { NOT_AVAILABLE } from '../../../constants';

const ajv = new Ajv();

function checkLoginDataMiddleware(req, res, next) {
  const validationResult = ajv.validate(LogingSchema, req.body);
  if (validationResult) {
    next();
  } else {
    res.status(StatusCodes.BAD_REQUEST).json(NOT_AVAILABLE);
  }
}

export { checkLoginDataMiddleware };
