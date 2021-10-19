import Ajv from 'ajv';
import { StatusCodes } from 'http-status-codes';
import { NOT_AVAILABLE } from '../../../constants';
import { ChangePatientSchema } from '../schemas/ChangePatientSchema';

const ajv = new Ajv();

function checkPatientDataMiddleware(req, res, next) {
  const validationResult = ajv.validate(ChangePatientSchema, req.body);
  if (!validationResult) {
    res.status(StatusCodes.BAD_REQUEST).json(NOT_AVAILABLE);
  } else {
    next();
  }
}

export { checkPatientDataMiddleware };
