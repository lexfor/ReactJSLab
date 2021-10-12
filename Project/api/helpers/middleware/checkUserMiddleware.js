import Ajv from 'ajv';
import { StatusCodes } from 'http-status-codes';
import { UserSchema } from '../schemas/UserSchema';
import { NOT_AVAILABLE } from '../../../constants';

const ajv = new Ajv();

function checkUserMiddleware(req, res, next) {
  const validationResult = ajv.validate(UserSchema, req.body);
  if (validationResult) {
    next();
  } else {
    res.status(StatusCodes.BAD_REQUEST).json(NOT_AVAILABLE);
  }
}

export { checkUserMiddleware };
