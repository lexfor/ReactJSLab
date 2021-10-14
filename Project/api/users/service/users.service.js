import { v1 as uuidv1 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import { DEFAULT_PHOTO_PATH } from '../../../constants';
import ApiError from '../../helpers/ApiError';

class UsersService {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }

  /**
     * create user
     * @param {object} userData
     * @returns {Promise<object>} user data
     */
  async createUser(userData) {
    const user = {
      id: uuidv1(),
      last_name: userData.lastName,
      first_name: userData.firstName,
      photo: DEFAULT_PHOTO_PATH,
      login: userData.login,
      password: await bcrypt.hashSync(userData.password, +process.env.SALT),
      role_id: userData.role,
    };
    await this.usersRepository.createUser(user);
    return user;
  }

  /**
     * delete user
     * @param {string} userID
     * @returns {Promise<string>} user ID
     */
  async deleteUser(userID) {
    await this.usersRepository.deleteUser(userID);
    return userID;
  }

  /**
     * update user
     * @param {string} userID
     * @param {object} user
     * @returns {Promise<string>} user ID
     */
  async updateUser(userID, user) {
    const userData = {
      ...user,
    };
    if (!userData.photo) {
      userData.photo = DEFAULT_PHOTO_PATH;
    }
    await this.usersRepository.updateUser(userID, userData);
    return userID;
  }

  /**
     * get users
     * @param {string} role
     * @param {string} name
     * @param {number} offset
     * @param {number} count
     * @param {object} sorts
     * @returns {Promise<object>} users
     */
  async getUsers(role, offset, count, name, sorts) {
    const users = await this.usersRepository.getUsers(role, offset, count, name, sorts);
    return {
      users,
      total: await this.usersRepository.getQueryCount(role, name),
    };
  }

  /**
   * get doctors
   * @param {string} name
   * @param {number} offset
   * @param {number} count
   * @param {object} sorts
   * @returns {Promise<object>} doctors
   */
  async getDoctors(offset, count, name, sorts) {
    const users = await this.usersRepository.getDoctors(offset, count, name, sorts);
    return {
      users,
      total: await this.usersRepository.getDoctorsQueryCount(name),
    };
  }

  /**
   * get doctors with chosen specialization
   * @param {string} specializationID
   * @param {string} name
   * @returns {Promise<object[]>} doctors
   */
  async getDoctorsBySpecializations(specializationID, name) {
    const users = await this.usersRepository.getDoctorsBySpecializations(specializationID, name);
    return users;
  }

  /**
     * get user by ID
     * @param {string} userID
     * @returns {Promise<object>} user data
     */
  async getUserByID(userID) {
    const user = await this.usersRepository.getUserByID(userID);
    return user;
  }

  /**
   * get doctor by ID
   * @param {string} userID
   * @returns {Promise<object>} doctor data
   */
  async getDoctorByID(userID) {
    const user = await this.usersRepository.getDoctorByID(userID);
    return user;
  }

  /**
     * login
     * @param {object} credentials
     * @returns {Promise<object>} user data
     */
  async login(credentials) {
    const user = await this.usersRepository.getUserByLogin(credentials.login);
    if (!user) {
      throw new ApiError('no such user', StatusCodes.UNAUTHORIZED);
    }
    if (await bcrypt.compareSync(credentials.password, user.password)) {
      return user;
    }
    throw new ApiError('wrong password', StatusCodes.UNAUTHORIZED);
  }

  /**
     * change password
     * @param {string} userID
     * @param {object} passwords
     * @returns {Promise<object>} user data
     */
  async changePassword(userID, passwords) {
    const user = await this.usersRepository.getUserByID(userID);
    if (await bcrypt.compareSync(passwords.oldPassword, user.password)) {
      await this.usersRepository.changePassword(
        userID,
        await bcrypt.hashSync(passwords.newPassword, +process.env.SALT),
      );
      return user;
    }
    throw new ApiError('wrong password', StatusCodes.UNAUTHORIZED);
  }
}

export { UsersService };
