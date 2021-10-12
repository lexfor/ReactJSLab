import Ajv from 'ajv';
import { StatusCodes } from 'http-status-codes';
import { NOT_AVAILABLE } from '../../../constants';
import { IDSchema } from '../schemas/IDSchema';

const ajv = new Ajv();

function checkIDMiddleware(req, res, next) {
  const validationResult = ajv.validate(IDSchema, req.params);
  if (!validationResult) {
    res.status(StatusCodes.BAD_REQUEST).json(NOT_AVAILABLE);
  } else {
    next();
  }
}

export { checkIDMiddleware };
