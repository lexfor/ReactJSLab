import { promisify } from 'util';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../../helpers/ApiError';

class DoctorSpecializationRepository {
  constructor(connection) {
    this.connection = connection;
  }

  /**
     * add specialization for doctor
     * @param {object} data
     * @returns {Promise<object>} created doctor
     */
  async addDoctorSpecialization(data) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'INSERT INTO doctors_specializations SET ?';
      await queryAsync(sql, data);
      return data;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
     * delete doctors specializations
     * @param {string} doctorID
     * @returns {Promise<object>} delete doctor ID
     */
  async deleteDoctorSpecialization(doctorID) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'DELETE FROM doctors_specializations WHERE doctor_id = ?';
      await queryAsync(sql, doctorID);
      return doctorID;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export { DoctorSpecializationRepository };
