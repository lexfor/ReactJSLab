import { promisify } from 'util';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../../helpers/ApiError';
import { namesAndDates } from '../../helpers/sorts/index';
import { nameCondition } from '../../helpers/conditions/index';

class ResolutionRepository {
  constructor(connection) {
    this.connection = connection;
  }

  /**
   * Create new resolution
   * @param {object} data
   * @returns {Promise<object>} resolution data
   */
  async createResolution(data) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'INSERT INTO resolutions SET ? ';
      await queryAsync(sql, data);
      return data;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Update resolution
   * @param {string} resolutionID
   * @param {string} resolutionValue
   * @returns {Promise<string>} resolution data
   */
  async updateResolution(resolutionID, resolutionValue) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = `UPDATE resolutions 
                   SET value = ? WHERE resolutions.id = ?`;
      await queryAsync(sql, [resolutionValue, resolutionID]);
      return resolutionID;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Delete resolution
   * @param {string} resolutionID
   * @returns {Promise<object>} resolution data
   */
  async deleteResolution(resolutionID) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'DELETE FROM resolutions WHERE id = ?';
      await queryAsync(sql, [resolutionID]);
      return resolutionID;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get resolutions
   * @param {string} patientID
   * @param {number} offset
   * @param {number} count
   * @param {string} name
   * @param {object} sorts
   * @returns {Promise<array>} resolution data
   */
  async getResolutions(patientID, offset, count, name, sorts) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = `SELECT
                   resolutions.*,
                   appointments.visit_date, 
                   users.first_name, 
                   users.last_name
                   FROM resolutions
                   INNER JOIN appointments ON appointments.id = resolutions.appointment_id
                   INNER JOIN users ON appointments.doctor_id = users.id
                   WHERE appointments.patient_id = ?
                   ${nameCondition(name)}
                   ${namesAndDates(sorts)}
                   LIMIT ?,?`;
      const resolutions = await queryAsync(sql, [patientID, +offset, +count]);
      return resolutions;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get resolutions
   * @param {string} doctorID
   * @param {string} name
   * @param {number} offset
   * @param {number} count
   * @param {object} sorts
   * @returns {Promise<array>} resolution data
   */
  async getMyResolutions(doctorID, offset, count, name, sorts) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = `SELECT
                   resolutions.*, appointments.visit_date, users.first_name, users.last_name FROM resolutions
                   INNER JOIN appointments ON appointments.id = resolutions.appointment_id
                   INNER JOIN users ON appointments.patient_id = users.id
                   WHERE appointments.doctor_id = ?
                   ${nameCondition(name)}
                   ${namesAndDates(sorts)}
                   LIMIT ?,?`;
      const resolutions = await queryAsync(sql, [doctorID, +offset, +count]);
      return resolutions;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * get an query result count
   * @param {string} patientID
   * @param {string} name
   * @returns {Promise<number>} query result count
   */
  async getPatientQueryCount(patientID, name) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = `SELECT COUNT(*) as count FROM resolutions
                   INNER JOIN appointments ON appointments.id = resolutions.appointment_id
                   INNER JOIN users ON appointments.doctor_id = users.id
                   WHERE appointments.patient_id = ?
                   ${nameCondition(name)}`;
      const [count] = await queryAsync(sql, [patientID]);
      return count.count;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * get an query result count
   * @param {string} doctorID
   * @param {string} name
   * @returns {Promise<number>} query result count
   */
  async getDoctorQueryCount(doctorID, name) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = `SELECT COUNT(*) as count FROM resolutions
                   INNER JOIN appointments ON appointments.id = resolutions.appointment_id
                   INNER JOIN users ON appointments.patient_id = users.id
                   WHERE appointments.doctor_id = ?
                   ${nameCondition(name)}`;
      const [count] = await queryAsync(sql, [doctorID]);
      return count.count;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export { ResolutionRepository };
