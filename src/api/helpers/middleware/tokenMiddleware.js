import { StatusCodes } from 'http-status-codes';
import ApiError from '../ApiError';

function tokenMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new ApiError('jwt token not found', StatusCodes.UNAUTHORIZED);
  } else {
    [, req.token] = authHeader.split(' ');
    next();
  }
}

export { tokenMiddleware };
