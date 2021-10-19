import Ajv from 'ajv';
import { StatusCodes } from 'http-status-codes';
import { NOT_AVAILABLE } from '../../../constants';
import { PaginationSchema } from '../schemas/PaginationSchema';

const ajv = new Ajv();

function paginationMiddleware(req, res, next) {
  const validationResult = ajv.validate(PaginationSchema, req.query);
  if (validationResult) {
    next();
  } else {
    res.status(StatusCodes.BAD_REQUEST).json(NOT_AVAILABLE);
  }
}

export { paginationMiddleware };
