import * as bcrypt from 'bcrypt';
import ApiError from '../../helpers/ApiError';
import { STATUSES } from '../../../constants';

class AuthenticationService {
  constructor(authenticationRepository) {
    this.authenticationRepository = authenticationRepository;
  }

  /**
   * Register new user
   * @param {object} user
   * @param {string} role
   * @returns {Promise<object>} created user
   */
  async register(user, role) {
    const cryptUser = {
      login: user.login,
      password: await bcrypt.hashSync(user.password, +process.env.SALT),
      role: role,
    };
    const createdUser = await this.authenticationRepository.createUser(cryptUser);
    return createdUser;
  }

  /**
   * Delete user
   * @param {string} userID
   * @returns {Promise<string>} deleted user ID
   */
  async deleteUser(userID) {
    const createdUser = await this.authenticationRepository.deleteUser(userID);
    return createdUser;
  }

  /**
   * Check user login
   * @param {object} user
   * @returns {Promise<object>} founded user
   */
  async login(user) {
    const foundedUser = await this.authenticationRepository.getUserByLogin(user.login);
    if (!foundedUser) {
      throw new ApiError('no such user', STATUSES.UNAUTHORISED);
    }
    if (await bcrypt.compareSync(user.password, foundedUser.password)) {
      return foundedUser;
    }
    throw new ApiError('wrong password', STATUSES.UNAUTHORISED);
  }

  /**
   * change user password
   * @param {string} oldPassword
   * @param {string} newPassword
   * @param {string} userID
   */
  async changePassword(userID, oldPassword, newPassword) {
    const foundedUser = await this.authenticationRepository.getUserByID(userID);

    if (!foundedUser) {
      throw new ApiError('no such user', STATUSES.UNAUTHORISED);
    }

    if (await bcrypt.compareSync(oldPassword, foundedUser.password)) {
      await this.authenticationRepository.changePassword(userID, await bcrypt.hashSync(newPassword, +process.env.SALT));
    }
    throw new ApiError('wrong password', STATUSES.UNAUTHORISED);
  }

  /**
   *Check is user already exist
   * @param {object} user
   */
  async isExist(user) {
    const foundedUser = await this.authenticationRepository.getUserByLogin(user.login);
    if (foundedUser) {
      throw new ApiError('user already exist', STATUSES.BAD_REQUEST);
    }
  }
}

export { AuthenticationService };
