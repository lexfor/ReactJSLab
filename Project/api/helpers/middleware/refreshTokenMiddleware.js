import { StatusCodes } from 'http-status-codes';
import { NOT_AVAILABLE } from '../../../constants';

function refreshTokenMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(StatusCodes.FORBIDDEN).json(NOT_AVAILABLE);
  } else {
    [, req.token] = authHeader.split(' ');
    next();
  }
}

export { refreshTokenMiddleware };
