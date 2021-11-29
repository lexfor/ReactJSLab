import { StatusCodes } from 'http-status-codes';
import { injector } from '../../../Injector';
import ApiError from '../ApiError';
import APIMessage from "../APIMessage";

const authenticationController = injector.getAuthenticationController;

async function authenticationMiddleware(req, res) {
  try {
    const authHeader = req.headers.authorization;
    console.log(authHeader);
    if (!authHeader) {
      throw new ApiError(new APIMessage('jwt token not found').message, StatusCodes.UNAUTHORIZED);
    }
    const header = authHeader.split(' ');
    console.log(header);
    let auth;
    if (header[0] === 'Bearer') {
      auth = header[1];
    }
    else {
      auth = authHeader;
    }

    const user = await authenticationController.checkToken(auth);

    if (user.getStatus !== StatusCodes.OK) {
      throw new ApiError(user.getStatus, user.getValue);
    }
    req.userID = user.getValue.id;
  } catch (e) {
    if (e.status) {
      throw new ApiError(e.message, e.status);
    }
    throw new ApiError('Auth server error, check token', StatusCodes.BAD_REQUEST);
  }
}

export { authenticationMiddleware };
