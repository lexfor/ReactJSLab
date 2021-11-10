import { StatusCodes } from 'http-status-codes';
import ApiError from '../ApiError';

function tokenMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new ApiError('jwt token not found', StatusCodes.UNAUTHORIZED);
  } else {
    const header = authHeader.split(' ');
    console.log(header);
    if (header[0] === 'Bearer') {
      req.token = header[1];
    }
    else {
      req.token = authHeader;
    }
    next();
  }
}

export { tokenMiddleware };
