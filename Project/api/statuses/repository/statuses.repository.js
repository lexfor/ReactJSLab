import { promisify } from 'util';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../../helpers/ApiError';

class StatusesRepository {
  constructor(connection) {
    this.connection = connection;
  }

  /**
     * Get all available statuses
     * @returns {Promise<array>} statuses array
     */
  async getAllStatuses() {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'SELECT * FROM statuses ';
      return await queryAsync(sql);
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export { StatusesRepository };
