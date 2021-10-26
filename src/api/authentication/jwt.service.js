import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../helpers/ApiError';

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
      const refreshToken = sign({
        userID,
        refresh: true,
      }, tokenKey);
      return {
        access_token: token,
        refresh_token: refreshToken,
      };
    } catch (e) {
      throw new ApiError('wrong sign', StatusCodes.INTERNAL_SERVER_ERROR);
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
      if (data.refresh) {
        return this.createSign(data.userID);
      }
      throw new Error('wrong refresh token');
    } catch (e) {
      throw new ApiError('wrong refresh token', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Verify jwt token
   * @param {string} token
   * @returns {string} userID
   */
  verifySign(token) {
    try {
      const payload = verify(token, process.env.TOKEN_KEY);
      return payload.userID;
    } catch (e) {
      throw new ApiError('wrong token', StatusCodes.FORBIDDEN);
    }
  }
}

export { JwtService };
