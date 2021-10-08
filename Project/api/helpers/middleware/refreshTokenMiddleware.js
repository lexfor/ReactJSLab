import {NOT_AVAILABLE, STATUSES} from '../../../constants';

function refreshTokenMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(STATUSES.FORBIDDEN).json(NOT_AVAILABLE);
    } else  {
        req.token = authHeader.split(' ')[1];
        next();
    }
}

export { refreshTokenMiddleware };
