import { StatusCodes } from 'http-status-codes';
import ApiError from '../helpers/ApiError';
import { nameCondition } from '../helpers/conditions';
import { ROLES_ID, SPECIALIZATION_NAME_JOIN } from '../../constants';
import { sort } from '../helpers/sort';
import { dataFilter } from '../helpers/dataFilter';

class UsersRepository {
  constructor(pool) {
    this.pool = pool;
  }

  /**
     * Create a user
     * @param {object} user
     * @returns {Promise<object>} user data
     */
  async createUser(user) {
    try {
      const sql = `INSERT INTO users (id, first_name, last_name, photo, login, password, role_id) VALUES (
        $1, $2, $3, $4, $5, $6, $7
        );`;
      await this.pool.query(sql, [
          user.id,
          user.first_name,
          user.last_name,
          user.photo,
          user.login,
          user.password,
          user.role_id,
      ]);
      const [result] = dataFilter([user]);
      return result;
    } catch (e) {
      console.log(e.message);
      throw new ApiError('SQL error', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
     * delete a user
     * @param {string} userID
     * @returns {Promise<object>} user ID
     */
  async deleteUser(userID) {
    try {
      const sql = 'DELETE FROM users WHERE id = $1';
      await this.pool.query(sql, [userID]);
      return userID;
    } catch (e) {
      console.log(e.message);
      throw new ApiError('SQL error', StatusCodes.INTERNAL_SERVER_ERROR);
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
      const sql = 'UPDATE users SET last_name = $1, first_name = $2, photo = $3 WHERE id = $4';
      await this.pool.query(sql, [user.lastName, user.firstName, user.photo, userID]);
      return user;
    } catch (e) {
      console.log(e.message);
      throw new ApiError('SQL error', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
     * change user password
     * @param {string} userID
     * @param {string} newPassword
     */
  async changePassword(userID, newPassword) {
    try {
      const sql = 'UPDATE users SET password = $1 WHERE id = $2';
      await this.pool.query(sql, [newPassword, userID]);
      return userID;
    } catch (e) {
      console.log(e.message);
      throw new ApiError('SQL error', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
     * get user by login
     * @param {string} login
     * @returns {object} user
     */
  async getUserByLogin(login) {
    try {
      const sql = `SELECT users.*, roles.role_name FROM users 
                   INNER JOIN roles ON roles.id = users.role_id
                   WHERE login = $1`;
      const { rows } = await this.pool.query(sql, [login]);
      const [result] = rows;
      return result;
    } catch (e) {
      console.log(e.message);
      throw new ApiError('SQL error', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
     * Get user by ID
     * @param {string} userID
     * @returns {Promise<object>} user data
     */
  async getUserByID(userID) {
    try {
      const sql = `
                SELECT users.*, roles.role_name 
                FROM users
                INNER JOIN roles ON roles.id = users.role_id
                WHERE users.id = $1`;
      const { rows } = await this.pool.query(sql, [userID]);
      const [result] = dataFilter(rows);
      return result;
    } catch (e) {
      console.log(e.message);
      throw new ApiError('SQL error', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get user by ID with password
   * @param {string} userID
   * @returns {Promise<object>} user data
   */
  async getUserByIDWithPassword(userID) {
    try {
      const sql = `
                SELECT users.*, roles.role_name 
                FROM users
                INNER JOIN roles ON roles.id = users.role_id
                WHERE users.id = $1`;
      const { rows } = await this.pool.query(sql, [userID]);
      const [result] = rows;
      return result;
    } catch (e) {
      console.log(e.message);
      throw new ApiError('SQL error', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get doctor by ID
   * @param {string} userID
   * @returns {Promise<object>} user data
   */
  async getDoctorByID(userID) {
    try {
      const sql = `
                SELECT 
                users.*, 
                roles.role_name,
                ${SPECIALIZATION_NAME_JOIN}
                FROM users
                INNER JOIN roles ON roles.id = users.role_id
                WHERE users.id = $1`;
      const { rows } = await this.pool.query(sql, [userID]);
      const [result] = dataFilter(rows);
      return result;
    } catch (e) {
      console.log(e.message);
      throw new ApiError('SQL error', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * check is admin by ID
   * @param {string} userID
   * @returns {Promise<object>} admin data
   */
  async checkIsAdmin(userID) {
    try {
      const sql = `
                SELECT 
                users.*, 
                roles.role_name
                FROM users
                INNER JOIN roles ON roles.id = users.role_id
                WHERE users.id = $1 AND users.role_id = $2`;
      const { rows } = await this.pool.query(sql, [userID, ROLES_ID.ADMIN]);
      const [result] = dataFilter(rows);
      return result;
    } catch (e) {
      console.log(e.message);
      throw new ApiError('SQL error', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * check is patient by ID
   * @param {string} userID
   * @returns {Promise<object>} patient data
   */
  async checkIsPatient(userID) {
    try {
      const sql = `
                SELECT 
                users.*, 
                roles.role_name
                FROM users
                INNER JOIN roles ON roles.id = users.role_id
                WHERE users.id = $1 AND users.role_id = $2`;
      const { rows } = await this.pool.query(sql, [userID, ROLES_ID.PATIENT]);
      const [result] = dataFilter(rows);
      return result;
    } catch (e) {
      console.log(e.message);
      throw new ApiError('SQL error', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * check is doctor by ID
   * @param {string} userID
   * @returns {Promise<object>} doctor data
   */
  async checkIsDoctor(userID) {
    try {
      const sql = `
                SELECT 
                users.*, 
                roles.role_name
                FROM users
                INNER JOIN roles ON roles.id = users.role_id
                WHERE users.id = $1 AND users.role_id = $2`;
      const { rows } = await this.pool.query(sql, [userID, ROLES_ID.DOCTOR]);
      const [result] = dataFilter(rows);
      return result;
    } catch (e) {
      console.log(e.message);
      throw new ApiError('SQL error', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
     * Get all users with role
     * @param {object} data
     * @returns {Promise<object>} users
     */
  async getUsers(data) {
    try {
      const sql = `
                SELECT COUNT(*) OVER() as total,
                users.*,
                roles.role_name 
                FROM users
                INNER JOIN roles ON roles.id = users.role_id
                WHERE role_id = $1
                ${nameCondition(data.name)}
                ${sort(data.sort, data.variant)}
                LIMIT $3 OFFSET $2`;
      const { rows } = await this.pool.query(sql, [data.role, +data.offset, +data.count]);
      return dataFilter(rows);
    } catch (e) {
      console.log(e.message);
      throw new ApiError('SQL error', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get all doctors
   * @param {object} data
   * @returns {Promise<object>} users
   */
  async getDoctors(data) {
    try {
      const sql = `
                SELECT COUNT(*) OVER() as total,
                users.*,
                roles.role_name, 
                ${SPECIALIZATION_NAME_JOIN}
                FROM users
                INNER JOIN roles ON roles.id = users.role_id
                WHERE role_id = $1
                ${nameCondition(data.name)}
                ${sort(data.sort, data.variant)}
                LIMIT $3 OFFSET $2`;
      const { rows } = await this.pool.query(sql, [ROLES_ID.DOCTOR, +data.offset, +data.count]);
      return dataFilter(rows);
    } catch (e) {
      console.log(e.message);
      throw new ApiError('SQL error', StatusCodes.INTERNAL_SERVER_ERROR);
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
      const sql = `SELECT users.firstName, users.lastName, users.id FROM users
                   INNER JOIN doctors_specializations ON users.id = doctors_specializations.doctor_id
                   WHERE doctors_specializations.specialization_id = $1
                   ${nameCondition(name)}`;
      const { rows } = await this.pool.query(sql, [specializationID]);
      return dataFilter(rows);
    } catch (e) {
      console.log(e.message);
      throw new ApiError('SQL error', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export { UsersRepository };
