import { promisify } from 'util';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../../helpers/ApiError';
import { nameCondition } from '../../helpers/conditions/index';
import { ROLES_ID } from '../../../constants';
import { namesAndSpecializationSort, namesSort } from '../../helpers/sorts/index';

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
     * @returns {object} user
     */
  async getUserByLogin(login) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = `SELECT users.*, roles.role_name FROM users 
                   INNER JOIN roles ON roles.id = users.role_id
                   WHERE login = ?`;
      const [result] = await queryAsync(sql, [login]);
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
     * @param {string} role
     * @param {string} name
     * @param {number} offset
     * @param {number} count
     * @param {object} sorts
     * @returns {Promise<array>} users
     */
  async getUsers(role, offset, count, name, sorts) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = `
                SELECT
                users.*, roles.role_name 
                FROM users
                INNER JOIN roles ON roles.id = users.role_id
                WHERE role_id = ?
                ${nameCondition(name)}
                ${namesSort(sorts)}
                LIMIT ?,?`;
      return await queryAsync(sql, [role, +offset, +count]);
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get all doctors
   * @param {string} name
   * @param {number} offset
   * @param {number} count
   * @param {object} sorts
   * @returns {Promise<array>} users
   */
  async getDoctors(offset, count, name, sorts) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = `
                SELECT users.*, roles.role_name, (
                SELECT GROUP_CONCAT(specializations.specialization_name SEPARATOR ', ') FROM specializations
                INNER JOIN doctors_specializations ON specializations.id = doctors_specializations.specialization_id
                WHERE users.id = doctors_specializations.doctor_id) as specialization_name
                FROM users
                INNER JOIN roles ON roles.id = users.role_id
                WHERE role_id = ?
                ${nameCondition(name)}
                ${namesAndSpecializationSort(sorts)}
                LIMIT ?,?`;
      const result = await queryAsync(sql, [ROLES_ID.DOCTOR, +offset, +count]);
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
      const sql = `SELECT * FROM users
                   INNER JOIN doctors_specializations ON users.id = doctors_specializations.doctor_id
                   WHERE doctors_specializations.specialization_id = ?
                   ${nameCondition(name)}`;
      const result = await queryAsync(sql, [specializationID]);
      return result;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * get an query result count
   * @param {string} role
   * @param {string} name
   * @returns {Promise<number>} query result count
   */
  async getQueryCount(role, name) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = `SELECT COUNT(*) as count FROM users
                   WHERE role_id = ?
                   ${nameCondition(name)}`;
      const [count] = await queryAsync(sql, [role]);
      return count.count;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * get an query result count
   * @param {string} name
   * @returns {Promise<number>} query result count
   */
  async getDoctorsQueryCount(name) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = `SELECT COUNT(*) as count, (
                SELECT GROUP_CONCAT(specializations.specialization_name SEPARATOR ', ') FROM specializations
                INNER JOIN doctors_specializations ON specializations.id = doctors_specializations.specialization_id
                WHERE users.id = doctors_specializations.doctor_id) as specialization_name
                FROM users
                INNER JOIN roles ON roles.id = users.role_id
                WHERE role_id = ?
                ${nameCondition(name)}`;
      const [count] = await queryAsync(sql, [ROLES_ID.DOCTOR]);
      return count.count;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export { UsersRepository };
