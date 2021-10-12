import { promisify } from 'util';
import { v1 as uuidv1 } from 'uuid';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../../helpers/ApiError';

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
      const uuid = uuidv1();
      const data = { id: uuid, ...appointmentData };
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'INSERT INTO appointments SET ?';
      await queryAsync(sql, data);
      return data;
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
     * @returns {Promise<array>} updated appointment ID
     */
  async getAppointmentsForDoctor(doctorID, name) {
    try {
      let nameCondition = '';
      if (name) {
        nameCondition = ` AND users.last_name = '%${name}%' OR 
                users.first_name = '%${name}%'`;
      }
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = `SELECT appointments.*, users.first_name, users.last_name, statuses.status, users.photo
                         FROM appointments 
                         JOIN users ON users.id = appointments.patient_id
                         JOIN statuses ON statuses.id = appointments.status_id
                         WHERE appointments.doctor_id = ?
                         ${nameCondition}`;
      const appointments = await queryAsync(sql, [doctorID]);
      return appointments;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
     * get an my appointments
     * @param {string} patientID
     * @param {string} name
     * @returns {Promise<array>} updated appointment ID
     */
  async getAppointmentsForPatient(patientID, name) {
    try {
      console.log(patientID);
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      let nameCondition = '';
      if (name) {
        nameCondition = ` AND users.last_name = '%${name}%' OR 
                users.first_name = '%${name}%'`;
      }
      const sql = `SELECT appointments.*,
                         users.first_name,
                         users.last_name,
                         users.photo
                         statuses.status, 
                         specializations.specialization_name 
                         FROM appointments 
                         JOIN users ON users.id = appointments.doctor_id
                         JOIN doctors_specializations ON users.id = doctors_specializations.doctor_id
                         JOIN specializations 
                         ON specializations.id = doctors_specializations.specialization_id = specializations.id
                         JOIN statuses ON statuses.id = appointments.status_id
                         WHERE appointments.patient_id = ?
                         ${nameCondition}`;
      const appointments = await queryAsync(sql, [patientID]);
      return appointments;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export { AppointmentsRepository };
