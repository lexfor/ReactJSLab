import Ajv from 'ajv';
import { StatusCodes } from 'http-status-codes';
import { NOT_AVAILABLE } from '../../../constants';
import { ChangeDoctorSchema } from '../schemas/ChangeDoctorSchema';

const ajv = new Ajv();

function checkDoctorDataMiddleware(req, res, next) {
  const validationResult = ajv.validate(ChangeDoctorSchema, req.body);
  if (!validationResult) {
    res.status(StatusCodes.BAD_REQUEST).json(NOT_AVAILABLE);
  } else {
    next();
  }
}

export { checkDoctorDataMiddleware };
