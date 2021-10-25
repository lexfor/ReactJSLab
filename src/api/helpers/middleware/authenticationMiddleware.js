import { StatusCodes } from 'http-status-codes';
import { NOT_AVAILABLE } from '../../../constants';
import { injector } from '../../../Injector';

const authenticationController = injector.getAuthenticationController;

async function authenticationMiddleware(req, res) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(StatusCodes.FORBIDDEN).json(NOT_AVAILABLE);
    }

    const auth = authHeader.split(' ')[1];
    const user = await authenticationController.checkToken(auth);

    if (user.getStatus !== StatusCodes.OK) {
      res.status(user.getStatus).json(user.getValue);
    }
    req.userID = user.getValue.id;
  } catch (e) {
    res.status(StatusCodes.UNAUTHORIZED).json(NOT_AVAILABLE);
  }

}

export { authenticationMiddleware };
