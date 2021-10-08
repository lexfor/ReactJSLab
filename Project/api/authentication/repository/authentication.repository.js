import { promisify } from 'util';
import { v1 as uuidv1 } from 'uuid';
import ApiError from '../../helpers/ApiError';
import { STATUSES } from '../../../constants';

class AuthenticationRepository {
  constructor(connection) {
    this.connection = connection;
  }

  /**
   * Create new user
   * @param {object} user
   * @returns {Promise<object>} user info
   */
  async createUser(user) {
    try {
      const uuid = uuidv1();
      const data = { id: uuid, ...user };
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'INSERT INTO users SET ?';
      await queryAsync(sql, data);
      return data;
    } catch (e) {
      throw new ApiError(e.message, STATUSES.SERVER_ERROR);
    }
  }

  /**
   * delete user
   * @param {string} userID
   * @returns {Promise<string>} user ID
   */
  async deleteUser(userID) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'DELETE FROM users WHERE id = ?';
      await queryAsync(sql, userID);
      return userID;
    } catch (e) {
      throw new ApiError(e.message, STATUSES.SERVER_ERROR);
    }
  }

  /**
   * Get user info
   * @param {string} login
   * @returns {Promise<object>} user
   */
  async getUserByLogin(login) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = `SELECT * FROM users
        WHERE 
        login = ?`;
      const [result] = await queryAsync(sql, login);
      return result;
    } catch (e) {
      throw new ApiError(e.message, STATUSES.SERVER_ERROR);
    }
  }

  /**
   * Get user info
   * @param {string} userID
   * @returns {Promise<object>} user
   */
  async getUserByID(userID) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = `SELECT * FROM users
        WHERE 
        id = ?`;
      const [result] = await queryAsync(sql, userID);
      return result;
    } catch (e) {
      throw new ApiError(e.message, STATUSES.SERVER_ERROR);
    }
  }

  /**
   * Get user info
   * @param {string} userID
   * @param {string} newPassword
   */
  async changePassword(userID, newPassword) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = `UPDATE users SET
        password = ?
        WHERE 
        id = ?`;
      await queryAsync(sql, [newPassword, userID]);
    } catch (e) {
      throw new ApiError(e.message, STATUSES.SERVER_ERROR);
    }
  }
}

export { AuthenticationRepository };
