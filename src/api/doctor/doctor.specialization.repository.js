import { promisify } from 'util';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../helpers/ApiError';
import {createConnection} from "../helpers/DBconnection";

class DoctorSpecializationRepository {
  /**
     * add specialization for doctor
     * @param {object} data
     * @returns {Promise<object>} created doctor
     */
  async addDoctorSpecialization(data) {
    const connection = await createConnection();
    try {
      const queryAsync = promisify(connection.query).bind(connection);
      const sql = 'INSERT INTO doctors_specializations SET ?';
      await queryAsync(sql, data);
      return data;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
    finally {
      await connection.end();
    }
  }

  /**
     * delete doctors specializations
     * @param {string} doctorID
     * @returns {Promise<object>} delete doctor ID
     */
  async deleteDoctorSpecialization(doctorID) {
    const connection = await createConnection();
    try {
      const queryAsync = promisify(connection.query).bind(connection);
      const sql = 'DELETE FROM doctors_specializations WHERE doctor_id = ?';
      await queryAsync(sql, doctorID);
      return doctorID;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
    finally {
      await connection.end();
    }
  }
}

export { DoctorSpecializationRepository };
