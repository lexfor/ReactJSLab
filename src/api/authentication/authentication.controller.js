import { StatusCodes } from 'http-status-codes';
import RequestResult from '../helpers/RequestResult';
import {ROLES_ID} from "../../constants";

class AuthenticationController {
  constructor(usersService, jwtService) {
    this.usersService = usersService;
    this.jwtService = jwtService;
  }

  /**
   * Create new user
   * @param {object} user
   * @returns {Promise<object>} created jwt token, user and status
   */
  async register(user) {
    const res = new RequestResult();
    try {
      const userData = {
        ...user,
        role_id: ROLES_ID.PATIENT,
      };
      await this.usersService.checkIsUserExist(userData.login);
      const createdUser = await this.usersService.createUser(userData);
      const foundedUser = this.usersService.getUserByID(createdUser.id);
      const result = this.jwtService.createSign(createdUser.id);
      result.user = foundedUser;
      res.setValue = result;
      res.setStatus = StatusCodes.CREATED;
      return res;
    } catch (e) {
      res.setValue = e.message;
      if (e.status) {
        res.setStatus = e.status;
      } else {
        res.setStatus = StatusCodes.INTERNAL_SERVER_ERROR;
      }
      return res;
    }
  }

  /**
   * Check user login
   * @param {object} user
   * @returns {Promise<object>} jwt token, user and status
   */
  async login(user) {
    const res = new RequestResult();
    try {
      const foundedUser = await this.usersService.login(user);
      const result = this.jwtService.createSign(foundedUser.id);
      result.user = foundedUser;
      res.setValue = result;
      res.setStatus = StatusCodes.OK;
      return res;
    } catch (e) {
      res.setValue = e.message;
      if (e.status) {
        res.setStatus = e.status;
      } else {
        res.setStatus = StatusCodes.INTERNAL_SERVER_ERROR;
      }
      return res;
    }
  }

  /**
   * Check jwt token
   * @param {string} token
   * @returns {Promise<object>} userID from jwt token and status
   */
  async checkToken(token) {
    const res = new RequestResult();
    try {
      const userID = this.jwtService.verifySign(token);
      res.setValue = await this.usersService.getUserByID(userID);
      res.setStatus = StatusCodes.OK;
      return res;
    } catch (e) {
      res.setValue = e.message;
      if (e.status) {
        res.setStatus = e.status;
      } else {
        res.setStatus = StatusCodes.INTERNAL_SERVER_ERROR;
      }
      return res;
    }
  }

  /**
   * refresh jwt token
   * @param {string} token
   * @returns {Promise<object>} refreshed jwt token and status
   */
  async refreshToken(token) {
    const res = new RequestResult();
    try {
      res.setValue = this.jwtService.refreshToken(token);
      res.setStatus = StatusCodes.OK;
      return res;
    } catch (e) {
      res.setValue = e.message;
      if (e.status) {
        res.setStatus = e.status;
      } else {
        res.setStatus = StatusCodes.INTERNAL_SERVER_ERROR;
      }
      return res;
    }
  }

  /**
   * change user password
   * @param {string} userID
   * @param {object} passwords
   * @returns {Promise<object>} status
   */
  async changePassword(userID, passwords) {
    const res = new RequestResult();
    try {
      await this.usersService.checkIsPatientExist(userID);
      res.setValue = await this.usersService.changePassword(userID, passwords);
      res.setStatus = StatusCodes.OK;
      return res;
    } catch (e) {
      res.setValue = e.message;
      if (e.status) {
        res.setStatus = e.status;
      } else {
        res.setStatus = StatusCodes.INTERNAL_SERVER_ERROR;
      }
      return res;
    }
  }
}

export { AuthenticationController };
