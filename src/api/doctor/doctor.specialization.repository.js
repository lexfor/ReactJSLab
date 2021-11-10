import { StatusCodes } from 'http-status-codes';
import ApiError from '../helpers/ApiError';

class DoctorSpecializationRepository {
  constructor(pool) {
    this.pool = pool;
  }

  /**
     * add specialization for doctor
     * @param {object} data
     * @returns {Promise<object>} created doctor
     */
  async addDoctorSpecialization(data) {
    try {
      const sql = 'INSERT INTO doctors_specializations (doctor_id, specialization_id) VALUES ($1, $2)';
      await this.pool.query(sql, [data.doctor_id, data.specialization_id]);
      return data;
    } catch (e) {
      console.log(e.message);
      throw new ApiError('SQL error', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
     * delete doctors specializations
     * @param {string} doctorID
     * @returns {Promise<object>} delete doctor ID
     */
  async deleteDoctorSpecialization(doctorID) {
    try {
      const sql = 'DELETE FROM doctors_specializations WHERE doctor_id = $1';
      await this.pool.query(sql, [doctorID]);
      return doctorID;
    } catch (e) {
      console.log(e.message);
      throw new ApiError('SQL error', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export { DoctorSpecializationRepository };
