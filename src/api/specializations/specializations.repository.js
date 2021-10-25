import { StatusCodes } from 'http-status-codes';
import ApiError from '../helpers/ApiError';

class SpecializationsRepository {
  constructor(pool) {
    this.pool = pool;
  }

  /**
     * Get all available doctors specializations
     * @returns {Promise<array>} specializations array
     */
  async getAllSpecializations() {
    try {
      const sql = 'SELECT * FROM specializations ';
      const { rows } = await this.pool.query(sql);
      return rows;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export { SpecializationsRepository };
