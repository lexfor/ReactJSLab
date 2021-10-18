import Ajv from 'ajv';
import { StatusCodes } from 'http-status-codes';
import { NOT_AVAILABLE } from '../../../constants';
import { ValueSchema } from '../schemas/valueSchema';
import { IDSchema } from '../schemas/IDSchema';

const ajv = new Ajv();

function checkResolutionMiddleware(req, res, next) {
  const validationResult = ajv.validate(ValueSchema, req.body);
  const validationUserResult = ajv.validate(IDSchema, req.params);
  if (validationResult && validationUserResult) {
    next();
  } else {
    res.status(StatusCodes.BAD_REQUEST).json(NOT_AVAILABLE);
  }
}

export { checkResolutionMiddleware };
