import { v1 as uuidv1 } from 'uuid';
import { promisify } from 'util';
import ApiError from '../../helpers/ApiError';
import { STATUSES } from '../../../constants';

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
      const uuid = uuidv1();
      const resolution = {
        ...data,
        id: uuid,
        createdTime: new Date().toISOString() ,
      };
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'INSERT INTO resolutions SET ? ';
      await queryAsync(sql, resolution);
      return resolution;
    } catch (e) {
      throw new ApiError(e.message, STATUSES.SERVER_ERROR);
    }
  }

  /**
   * Update resolution
   * @param {string} resolutionID
   * @param {string} resolutionValue
   * @returns {Promise<string>} resolution data
   */
  async updateResolution(resolutionID, resolutionValue, doctorID) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'UPDATE resolutions SET value = ? WHERE id = ? AND doctor_id = ?';
      await queryAsync(sql, [resolutionValue, resolutionID, doctorID]);
      return resolutionID;
    } catch (e) {
      throw new ApiError(e.message, STATUSES.SERVER_ERROR);
    }
  }

  /**
   * Delete resolution
   * @param {string} resolutionID
   * @param {string} doctorID
   * @returns {Promise<object>} resolution data
   */
  async deleteResolution(resolutionID, doctorID) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'DELETE FROM resolutions WHERE id = ? AND doctor_id = ?';
      await queryAsync(sql, [resolutionID, doctorID]);
      return { id: resolutionID };
    } catch (e) {
      throw new ApiError(e.message, STATUSES.SERVER_ERROR);
    }
  }

  /**
   * Get resolutions
   * @param {string} patientID
   * @returns {Promise<array>} resolution data
   */
  async getResolutions(patientID) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = `SELECT 
                   resolutions.*, 
                   doctors.first_name, 
                   doctors.last_name
                   FROM resolutions
                   INNER JOIN doctors ON resolutions.doctor_id = doctors.id
                   WHERE resolutions.patient_id = ?`;
      const resolutions = await queryAsync(sql, [patientID]);
      return resolutions;
    } catch (e) {
      throw new ApiError(e.message, STATUSES.SERVER_ERROR);
    }
  }

  /**
   * Get resolutions
   * @param {string} doctorID
   * @returns {Promise<array>} resolution data
   */
  async getMyResolutions(doctorID) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = `SELECT resolutions.*, patients.first_name, patients.last_name FROM resolutions
                   INNER JOIN patients ON resolutions.patient_id = patients.id
                   WHERE resolutions.doctor_id = ?`;
      const resolutions = await queryAsync(sql, [doctorID]);
      return resolutions;
    } catch (e) {
      throw new ApiError(e.message, STATUSES.SERVER_ERROR);
    }
  }
}

export { ResolutionRepository };
