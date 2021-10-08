import { promisify } from 'util';
import { v1 as uuidv1 } from 'uuid';
import ApiError from '../../helpers/ApiError';
import { STATUSES } from '../../../constants';

class DoctorRepository {
  constructor(connection) {
    this.connection = connection;
  }

  /**
   * create new doctor
   * @param {object} data
   * @returns {Promise<object>} created doctor
   */
  async createDoctor(data) {
    try {
      const doctor = {
        ...data,
        id: uuidv1(),
      }
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'INSERT INTO doctors SET ?';
      await queryAsync(sql, doctor);
      return doctor;
    } catch (e) {
      throw new ApiError(e.message, STATUSES.SERVER_ERROR);
    }
  }

  /**
   * delete doctor
   * @param {string} doctorID
   * @returns {Promise<object>} delete doctor ID
   */
  async deleteDoctor(doctorID) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'DELETE FROM doctors WHERE id = ?';
      await queryAsync(sql, doctorID);
      return doctorID;
    } catch (e) {
      throw new ApiError(e.message, STATUSES.SERVER_ERROR);
    }
  }

  /**
   * update doctor
   * @param {string} doctorID
   * @param {object} doctor
   * @returns {Promise<object>} updated doctor ID
   */
  async updateDoctor(doctorID, doctor) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'UPDATE doctors SET first_name = ?, last_name = ? WHERE id = ?';
      await queryAsync(sql, [doctor.firstName, doctor.lastName, doctorID]);
      return doctorID;
    } catch (e) {
      throw new ApiError(e.message, STATUSES.SERVER_ERROR);
    }
  }

  /**
   * get all doctors
   * @param {string} specializationID
   * @returns {Promise<array>} get all doctors
   */
  async getDoctors(specializationID) {
    try {
      let condition = '';
      if (specializationID) {
        condition = ' WHERE specialization_id = ? '
      }
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = `SELECT doctors.*, GROUP_CONCAT(specializations.specialization_name SEPARATOR ', ') 
                   as specialization_name FROM doctors 
                   INNER JOIN doctors_specializations ON doctors_specializations.doctor_id = doctors.id
                   INNER JOIN specializations ON specializations.id = doctors_specializations.specialization_id
                   ${condition}`;
      const doctors = await queryAsync(sql, specializationID);
      return doctors;
    } catch (e) {
      throw new ApiError(e.message, STATUSES.SERVER_ERROR);
    }
  }

  /**
   * Get doctor by ID
   * @param {string} doctorID
   * @returns {Promise<object>} founded doctor
   */
  async getDoctorByID(doctorID) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = `
      SELECT doctors.*, specializations.specialization_name FROM doctors
      JOIN doctors_specializations
      ON doctors_specializations.doctor_id = doctors.id 
      INNER JOIN specializations
      ON doctors_specializations.specialization_id = specializations.id
      WHERE doctors.id = ?`;
      const [result] = await queryAsync(sql, doctorID);
      return result;
    } catch (e) {
      throw new ApiError(e.message, STATUSES.SERVER_ERROR);
    }
  }

  /**
   * Get doctor by ID
   * @param {string} userID
   * @returns {Promise<object>} founded doctor
   */
  async getDoctorByUserID(userID) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = `
      SELECT doctors.*, specializations.specialization_name FROM doctors
      JOIN doctors_specializations
      ON doctors_specializations.doctor_id = doctors.id 
      INNER JOIN specializations
      ON doctors_specializations.specialization_id = specializations.id
      WHERE doctors.user_id = ?`;
      const [result] = await queryAsync(sql, userID);
      return result;
    } catch (e) {
      throw new ApiError(e.message, STATUSES.SERVER_ERROR);
    }
  }
}

export { DoctorRepository };
