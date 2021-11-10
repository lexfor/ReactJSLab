import { StatusCodes } from 'http-status-codes';
import { injector } from '../../../Injector';
import ApiError from '../ApiError';

const authenticationController = injector.getAuthenticationController;

async function authenticationMiddleware(req, res) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new ApiError('jwt token not found', StatusCodes.UNAUTHORIZED);
    }

    const auth = authHeader.split(' ')[1];
    const user = await authenticationController.checkToken(auth);

    if (user.getStatus !== StatusCodes.OK) {
      throw new ApiError(user.getStatus, user.getValue);
    }
    req.userID = user.getValue.id;
  } catch (e) {
    if (e.status) {
      throw new ApiError(e.message, e.status);
    }
    throw new ApiError('Auth server error, check sent token', StatusCodes.BAD_REQUEST);
  }
}

export { authenticationMiddleware };
