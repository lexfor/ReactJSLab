import { promisify } from 'util';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../helpers/ApiError';
import {createConnection} from "../helpers/DBconnection";

class SpecializationsRepository {
  /**
     * Get all available doctors specializations
     * @returns {Promise<array>} specializations array
     */
  async getAllSpecializations() {
    const connection = await createConnection();
    try {
      const queryAsync = promisify(connection.query).bind(connection);
      const sql = 'SELECT * FROM specializations ';
      return await queryAsync(sql);
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
    finally {
      await connection.end();
    }
  }
}

export { SpecializationsRepository };
