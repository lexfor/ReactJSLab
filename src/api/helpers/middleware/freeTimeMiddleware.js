import Ajv from 'ajv';
import { StatusCodes } from 'http-status-codes';
import { NOT_AVAILABLE } from '../../../constants';
import { FreeTimeSchema } from '../schemas/FreeTimeSchema';

const ajv = new Ajv();

function freeTimeMiddleware(req, res, next) {
  const validationResult = ajv.validate(FreeTimeSchema, req.body);
  if (!validationResult) {
    res.status(StatusCodes.BAD_REQUEST).json(NOT_AVAILABLE);
  } else {
    next();
  }
}

export { freeTimeMiddleware };
