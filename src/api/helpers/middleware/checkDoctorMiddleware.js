import Ajv from 'ajv';
import { StatusCodes } from 'http-status-codes';
import { NOT_AVAILABLE } from '../../../constants';
import { DoctorSchema } from '../schemas/DoctorSchema';

const ajv = new Ajv();

function checkDoctorMiddleware(req, res, next) {
  const validationResult = ajv.validate(DoctorSchema, req.body);
  if (!validationResult) {
    res.status(StatusCodes.BAD_REQUEST).json(NOT_AVAILABLE);
  } else {
    next();
  }
}

export { checkDoctorMiddleware };
