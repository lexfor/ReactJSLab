import Ajv from 'ajv';
import { StatusCodes } from 'http-status-codes';
import { NOT_AVAILABLE } from '../../../constants';
import { QueueIDSchema } from '../schemas/QueueIDSchema';

const ajv = new Ajv();

function checkQueueIDMiddleware(req, res, next) {
  const validationResult = ajv.validate(QueueIDSchema, req.params);
  if (!validationResult) {
    res.status(StatusCodes.BAD_REQUEST).json(NOT_AVAILABLE);
  } else {
    next();
  }
}

export { checkQueueIDMiddleware };
