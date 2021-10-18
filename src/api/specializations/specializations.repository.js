import { promisify } from 'util';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../helpers/ApiError';

class SpecializationsRepository {
  constructor(connection) {
    this.connection = connection;
  }

  /**
     * Get all available doctors specializations
     * @returns {Promise<array>} specializations array
     */
  async getAllSpecializations() {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'SELECT * FROM specializations ';
      return await queryAsync(sql);
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get all available doctors specializations
   * @param {string} specializationID
   * @returns {Promise<array>} specializations array
   */
  async getSpecializationByID(specializationID) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'SELECT specializations.specialization_name FROM specializations WHERE id = ?';
      const [result] = await queryAsync(sql, [specializationID]);
      return result;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export { SpecializationsRepository };
