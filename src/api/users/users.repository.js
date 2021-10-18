import { promisify } from 'util';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../helpers/ApiError';
import { nameCondition } from '../helpers/conditions';
import { ROLES_ID } from '../../constants';
import { sort } from '../helpers/sort';

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
     * get user by login
     * @param {string} login
     * @param {string} role
     * @returns {object} user
     */
  async getUserByLogin(login, role) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = `SELECT users.*, roles.role_name FROM users 
                   INNER JOIN roles ON roles.id = users.role_id
                   WHERE login = ? AND role = ?`;
      const [result] = await queryAsync(sql, [login, role]);
      return result;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
     * Get user by ID
     * @param {string} userID
     * @returns {Promise<object>} user data
     */
  async getUserByID(userID) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = `
                SELECT users.*, roles.role_name 
                FROM users
                INNER JOIN roles ON roles.id = users.role_id
                WHERE users.id = ?`;
      const [result] = await queryAsync(sql, userID);
      return result;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get doctor by ID
   * @param {string} userID
   * @returns {Promise<object>} user data
   */
  async getDoctorByID(userID) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = `
                SELECT 
                users.*, 
                roles.role_name,
                GROUP_CONCAT(specializations.specialization_name SEPARATOR ', ') as specialization_name
                FROM users
                INNER JOIN roles ON roles.id = users.role_id
                INNER JOIN doctors_specializations ON users.id = doctors_specializations.doctor_id 
                INNER JOIN specializations ON specializations.id = doctors_specializations.specialization_id
                WHERE users.id = ?`;
      const [result] = await queryAsync(sql, userID);
      return result;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
     * Get all users with role
     * @param {object} data
     * @returns {Promise<array>} users
     */
  async getUsers(data) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = `
                SELECT COUNT(*) OVER() as total,
                users.*, roles.role_name 
                FROM users
                INNER JOIN roles ON roles.id = users.role_id
                WHERE role_id = ?
                ${nameCondition(data.name)}
                ${sort(data.sort, data.variant)}
                LIMIT ?,?`;
      return await queryAsync(sql, [data.role, +data.offset, +data.count]);
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get all doctors
   * @param {object} data
   * @returns {Promise<array>} users
   */
  async getDoctors(data) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = `
                SELECT COUNT(*) OVER() as total,
                users.*, roles.role_name, 
                (
                  SELECT GROUP_CONCAT(specializations.specialization_name SEPARATOR ', ') FROM specializations
                  INNER JOIN doctors_specializations ON specializations.id = doctors_specializations.specialization_id
                  WHERE users.id = doctors_specializations.doctor_id
                ) as specialization_name
                FROM users
                INNER JOIN roles ON roles.id = users.role_id
                WHERE role_id = ?
                ${nameCondition(data.name)}
                ${sort(data.sort, data.variant)}
                LIMIT ?,?`;
      const result = await queryAsync(sql, [ROLES_ID.DOCTOR, +data.offset, +data.count]);
      return result;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get all doctors with specialization
   * @param {string} name
   * @param {string} specializationID
   * @returns {Promise<array>} users
   */
  async getDoctorsBySpecializations(specializationID, name) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = `SELECT users.* FROM users
                   INNER JOIN doctors_specializations ON users.id = doctors_specializations.doctor_id
                   WHERE doctors_specializations.specialization_id = ?
                   ${nameCondition(name)}`;
      const result = await queryAsync(sql, [specializationID]);
      return result;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export { UsersRepository };
