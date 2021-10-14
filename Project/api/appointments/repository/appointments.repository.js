import { promisify } from 'util';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../../helpers/ApiError';
import { nameCondition, checkDoctorIDCondition, checkDateStatus } from '../../helpers/conditions/index';
import { dateAndNameSort } from '../../helpers/sorts/index';

class AppointmentsRepository {
  constructor(connection) {
    this.connection = connection;
  }

  /**
     * Create new appointment
     * @param {object} appointmentData
     * @returns {Promise<object>} appointment info
     */
  async createAppointment(appointmentData) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'INSERT INTO appointments SET ?';
      await queryAsync(sql, appointmentData);
      return appointmentData;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
     * delete an appointment
     * @param {string} appointmentID
     * @param {string} userID
     * @returns {Promise<object>} deleted appointment ID
     */
  async deleteAppointment(appointmentID, userID) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'DELETE FROM appointments WHERE id = ? AND doctor_id = ?';
      await queryAsync(sql, [appointmentID, userID]);
      return appointmentID;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
     * update an appointment
     * @param {string} appointmentID
     * @param {string} statusID
     * @param {string} doctorID
     * @returns {Promise<object>} updated appointment ID
     */
  async updateAppointment(appointmentID, statusID, doctorID) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'UPDATE appointments SET status_id = ? WHERE id = ? AND doctor_id = ?';
      await queryAsync(sql, [statusID, appointmentID, doctorID]);
      return appointmentID;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
     * get an appointments
     * @param {string} doctorID
     * @param {string} name
     * @param {object} sorts
     * @param {number} offset
     * @param {number} count
     * @returns {Promise<array>} updated appointment ID
     */
  async getAppointmentsForDoctor(doctorID, offset, count, name, sorts) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = `SELECT
                         appointments.*, users.first_name, users.last_name, statuses.status_name, users.photo
                         FROM appointments 
                         JOIN users ON users.id = appointments.patient_id
                         JOIN statuses ON statuses.id = appointments.status_id
                         WHERE appointments.doctor_id = ?
                         ${nameCondition(name)}
                         ${dateAndNameSort(sorts)}
                         LIMIT ?,?`;
      const appointments = await queryAsync(sql, [doctorID, +offset, +count]);
      return appointments;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
     * get an my appointments
     * @param {string} patientID
     * @param {string} name
     * @param {number} offset
     * @param {number} count
     * @param {object} sorts
     * @param {object} dateStatus
     * @returns {Promise<array>} updated appointment ID
     */
  async getAppointmentsForPatient(patientID, offset, count, name, dateStatus, sorts) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = `SELECT
                         appointments.*,
                         users.first_name,
                         users.last_name,
                         users.photo,
                         statuses.status_name, 
                         (
                         SELECT GROUP_CONCAT(specializations.specialization_name SEPARATOR ', ') FROM specializations
                         INNER JOIN doctors_specializations ON specializations.id = doctors_specializations.specialization_id
                         WHERE users.id = doctors_specializations.doctor_id
                         ) as specialization_name
                         FROM appointments 
                         JOIN users ON users.id = appointments.doctor_id
                         JOIN statuses ON statuses.id = appointments.status_id
                         WHERE appointments.patient_id = ?
                         ${nameCondition(name)}
                         ${checkDateStatus(dateStatus)}
                         ${dateAndNameSort(sorts)}
                         LIMIT ?,?`;
      const appointments = await queryAsync(sql, [patientID, +offset, +count]);
      return appointments;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * get an appointments
   * @param {string} date
   * @param {string} doctorID
   * @returns {Promise<array>}appointments
   */
  async getAppointments(date, doctorID) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = `SELECT * FROM appointments 
                         WHERE visit_date LIKE '%${date}%'
                         ${checkDoctorIDCondition(doctorID)}`;
      const appointments = await queryAsync(sql, [doctorID]);
      return appointments;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * get an appointment data
   * @param {string} appointmentID
   * @returns {Promise<object>} appointment
   */
  async getAppointmentByID(appointmentID) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = `SELECT * FROM appointments 
                         WHERE id = ?`;
      const [appointment] = await queryAsync(sql, [appointmentID]);
      return appointment;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * get an query result count
   * @param {string} name
   * @param {object} dateStatus
   * @param {string} patientID
   * @returns {Promise<number>} query result count
   */
  async getPatientQueryCount(patientID, name, dateStatus) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = `SELECT COUNT(*) as count, (
                   SELECT GROUP_CONCAT(specializations.specialization_name SEPARATOR ', ') FROM specializations
                   INNER JOIN doctors_specializations ON specializations.id = doctors_specializations.specialization_id
                   WHERE users.id = doctors_specializations.doctor_id) as specialization_name FROM appointments
                   JOIN users ON users.id = appointments.doctor_id
                   WHERE appointments.patient_id = ?
                   ${nameCondition(name)}
                   ${checkDateStatus(dateStatus)}`;
      const [count] = await queryAsync(sql, [patientID]);
      return count.count;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * get an query result count
   * @param {string} name
   * @param {string} doctorID
   * @returns {Promise<number>} query result count
   */
  async getDoctorQueryCount(doctorID, name) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = `SELECT COUNT(*) as count FROM appointments
                   JOIN users ON users.id = appointments.patient_id
                   WHERE appointments.doctor_id = ?
                   ${nameCondition(name)}`;
      const [count] = await queryAsync(sql, [doctorID]);
      return count.count;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export { AppointmentsRepository };
