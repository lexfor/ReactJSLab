import { v1 as uuidv1 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import * as fs from 'fs';
import { DEFAULT_PHOTO_PATH } from '../../constants';
import ApiError from '../helpers/ApiError';

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
      role_id: userData.role_id,
    };
    return await this.usersRepository.createUser(user);
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
    const currentUser = await this.usersRepository.getUserByID(userID);
    if (!userData.photo) {
      userData.photo = currentUser.photo;
    } else {
      await fs.unlinkSync(`.${currentUser.photo}`);
    }
    await this.usersRepository.updateUser(userID, userData);
    return userID;
  }

  /**
     * get users
     * @param {object} data
     * @returns {Promise<object>} users
     */
  async getUsers(data) {
    const users = await this.usersRepository.getUsers(data);
    if (users.length === 0) {
      return {
        users,
        total: 0,
      };
    }
    const [{ total }] = users;

    return {
      users: users.map((item) => {
        delete item.total;
        return item;
      }),
      total,
    };
  }

  /**
   * get doctors
   * @param {object} data
   * @returns {Promise<object>} doctors
   */
  async getDoctors(data) {
    const users = await this.usersRepository.getDoctors(data);
    if (users.length === 0) {
      return {
        users,
        total: 0,
      };
    }
    const [{ total }] = users;

    return {
      users: users.map((item) => {
        delete item.total;
        return item;
      }),
      total,
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
    if (!user) {
      throw new ApiError('user not exist', StatusCodes.NOT_FOUND);
    }
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
   * check is patient exist
   * @param {string} userID
   */
  async checkIsPatientExist(userID) {
    const user = await this.usersRepository.getUserByID(userID);
    if (!user) {
      throw new ApiError('User not exist', StatusCodes.NOT_FOUND);
    }
  }

  /**
   * check is user already exist
   * @param {string} login
   */
  async checkIsUserExist(login) {
    const user = await this.usersRepository.getUserByLogin(login);
    if (user) {
      throw new ApiError('User already exist', StatusCodes.BAD_REQUEST);
    }
  }

  /**
   * check is doctor exist
   * @param {string} userID
   */
  async checkIsDoctorExist(userID) {
    const doctor = await this.usersRepository.getDoctorByID(userID);
    if (!doctor) {
      throw new ApiError('Doctor not exist', StatusCodes.NOT_FOUND);
    }
  }

  /**
   * check is admin
   * @param {string} userID
   */
  async checkIsAdmin(userID) {
    const admin = await this.usersRepository.checkIsAdmin(userID);
    if (!admin) {
      throw new ApiError('You are not admin', StatusCodes.NOT_FOUND);
    }
  }

  /**
   * check is patient
   * @param {string} userID
   */
  async checkIsPatient(userID) {
    const admin = await this.usersRepository.checkIsPatient(userID);
    if (!admin) {
      throw new ApiError('You are not patient', StatusCodes.NOT_FOUND);
    }
  }

  /**
   * check is doctor
   * @param {string} userID
   */
  async checkIsDoctor(userID) {
    const admin = await this.usersRepository.checkIsDoctor(userID);
    if (!admin) {
      throw new ApiError('You are not doctor', StatusCodes.NOT_FOUND);
    }
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
    const user = await this.usersRepository.getUserByIDWithPassword(userID);
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
