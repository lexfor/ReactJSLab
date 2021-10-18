import Ajv from 'ajv';
import { StatusCodes } from 'http-status-codes';
import { NOT_AVAILABLE } from '../../../constants';
import { ChangePasswordSchema } from '../schemas/ChangePasswordSchema';

const ajv = new Ajv();

function checkPasswordsMiddleware(req, res, next) {
  const validationResult = ajv.validate(ChangePasswordSchema, req.body);
  if (!validationResult) {
    res.status(StatusCodes.BAD_REQUEST).json(NOT_AVAILABLE);
  } else {
    next();
  }
}

export { checkPasswordsMiddleware };
