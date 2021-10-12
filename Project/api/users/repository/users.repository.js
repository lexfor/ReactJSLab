import { promisify } from 'util';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../../helpers/ApiError';

class UsersRepository {
  constructor(connection) {
    this.connection = connection;
  }

  /**
     * Create a user
     * @param {object} user
     * @returns {Promise<object>} user data
     */
  async createUser(user) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = `
                INSERT INTO users SET ?`;
      const result = await queryAsync(sql, user);
      return result;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
     * delete a user
     * @param {string} userID
     * @returns {Promise<object>} user ID
     */
  async deleteUser(userID) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'DELETE FROM users WHERE id = ?';
      await queryAsync(sql, userID);
      return userID;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
     * update a user
     * @param {string} userID
     * @param {object} user
     * @returns {Promise<object>} user data
     */
  async updateUser(userID, user) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'UPDATE users SET last_name = ?, first_name = ?, photo = ? WHERE id = ?';
      await queryAsync(sql, [user.lastName, user.firstName, user.photo, userID]);
      return user;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
     * change user password
     * @param {string} userID
     * @param {string} newPassword
     */
  async changePassword(userID, newPassword) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'UPDATE users SET password = ? WHERE id = ?';
      const result = await queryAsync(sql, [newPassword, userID]);
      return result;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
     * login
     * @param {string} login
     * @returns {object} user
     */
  async getUserByLogin(login) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'SELECT * FROM users WHERE login = ?';
      const [result] = await queryAsync(sql, [login]);
      return result;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
     * Get admin by user ID
     * @param {string} userID
     * @returns {Promise<object>} user data
     */
  async getUserByID(userID) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = `
                SELECT * 
                FROM users
                WHERE id = ?
                AND role_id = ?`;
      const [result] = await queryAsync(sql, userID);
      return result;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
     * Get all users with role
     * @param {string} role
     * @param {string} name
     * @returns {Promise<array>} users
     */
  async getUsers(role, name) {
    try {
      let nameCondition = '';
      if (name) {
        nameCondition = ` AND (users.last_name LIKE '%${name}%' OR 
                users.first_name LIKE '%${name}%')`;
      }
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = `
                SELECT *
                FROM users
                WHERE role_id = ?
                ${nameCondition}`;
      return await queryAsync(sql, role);
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export { UsersRepository };
