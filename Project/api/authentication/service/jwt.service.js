import jwt from 'jsonwebtoken';
import ApiError from '../../helpers/ApiError';
import { STATUSES } from '../../../constants';

const { sign, verify, decode } = jwt;

class JwtService {
  /**
   * Create jwt sign by user ID
   * @param {string} userID
   * @param {string} tokenKey
   * @returns {object} jwt token
   */
  createSign(userID, tokenKey = process.env.TOKEN_KEY) {
    try {
      const token = sign({
        userID,
      }, tokenKey, { expiresIn: +process.env.TOKEN_EXPIRATION });
      return { access_token: token };
    } catch (e) {
      throw new ApiError('wrong sign', STATUSES.SERVER_ERROR);
    }
  }

  /**
   * refresh jwt token
   * @param {string} token
   * @returns {object} jwt token
   */
  refreshToken(token) {
    try {
      const data = decode(token);
      return this.createSign(data.payload.userID);
    } catch (e) {
      throw new ApiError('wrong sign', STATUSES.SERVER_ERROR);
    }
  }

  /**
   * Verify jwt token
   * @param {string} token
   * @returns {string} userID
   */
  verifySign(token) {
    try {
      const userID = verify(token, process.env.TOKEN_KEY);
      return userID;
    } catch (e) {
      throw new ApiError('wrong token', STATUSES.FORBIDDEN);
    }
  }
}

export { JwtService };
