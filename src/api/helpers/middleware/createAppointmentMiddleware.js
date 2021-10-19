import Ajv from 'ajv';
import { StatusCodes } from 'http-status-codes';
import { NOT_AVAILABLE } from '../../../constants';
import { CreateAppointmentSchema } from '../schemas/CreateAppointmentSchema';

const ajv = new Ajv();

function createAppointmentMiddleware(req, res, next) {
  const validationResult = ajv.validate(CreateAppointmentSchema, req.body);
  if (!validationResult) {
    res.status(StatusCodes.BAD_REQUEST).json(NOT_AVAILABLE);
  } else {
    next();
  }
}

export { createAppointmentMiddleware };
