import { promisify } from 'util';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../helpers/ApiError';
import { nameCondition, checkDoctorIDCondition, checkDateStatus } from '../helpers/conditions';
import { sort } from '../helpers/sort';
import {createConnection} from "../helpers/DBconnection";

class AppointmentsRepository {

  /**
     * Create new appointment
     * @param {object} appointmentData
     * @returns {Promise<object>} appointment info
     */
  async createAppointment(appointmentData) {
    const connection = await createConnection();
    try {
      const queryAsync = promisify(connection.query).bind(connection);
      const sql = 'INSERT INTO appointments SET ?';
      await queryAsync(sql, appointmentData);
      return appointmentData;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
    finally {
      await connection.end();
    }
  }

  /**
     * delete an appointment
     * @param {string} appointmentID
     * @param {string} userID
     * @returns {Promise<object>} deleted appointment ID
     */
  async deleteAppointment(appointmentID, userID) {
    const connection = await createConnection();
    try {
      const queryAsync = promisify(connection.query).bind(connection);
      const sql = 'DELETE FROM appointments WHERE id = ?';
      await queryAsync(sql, [appointmentID, userID]);
      return appointmentID;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
    finally {
      await connection.end();
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
    const connection = await createConnection();
    try {
      const queryAsync = promisify(connection.query).bind(connection);
      const sql = 'UPDATE appointments SET status = ? WHERE id = ?';
      await queryAsync(sql, [statusID, appointmentID, doctorID]);
      return appointmentID;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
    finally {
      await connection.end();
    }
  }

  /**
     * get an appointments
     * @param {object} data
     * @returns {Promise<array>} updated appointment ID
     */
  async getAppointmentsForDoctor(data) {
    const connection = await createConnection();
    try {
      const queryAsync = promisify(connection.query).bind(connection);
      const sql = `SELECT COUNT(*) OVER() as total,
                         appointments.*,
                         users.first_name, 
                         users.last_name, 
                         users.photo
                         FROM appointments 
                         JOIN users ON users.id = appointments.patient_id
                         WHERE appointments.doctor_id = ?
                         ${nameCondition(data.name)}
                         ${sort(data.sort, data.variant)}
                         LIMIT ?,?`;
      const appointments = await queryAsync(sql, [data.doctorID, +data.offset, +data.count]);
      return appointments;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
    finally {
      await connection.end();
    }
  }

  /**
     * get an my appointments
     * @param {object} data
     * @returns {Promise<array>} updated appointment ID
     */
  async getAppointmentsForPatient(data) {
    const connection = await createConnection();
    try {
      const queryAsync = promisify(connection.query).bind(connection);
      const sql = `SELECT COUNT(*) OVER() as total,
                         appointments.*,
                         users.first_name,
                         users.last_name,
                         users.photo,
                         (
                           SELECT GROUP_CONCAT(specializations.specialization_name SEPARATOR ', ') FROM specializations
                           INNER JOIN doctors_specializations ON specializations.id = doctors_specializations.specialization_id
                           WHERE users.id = doctors_specializations.doctor_id
                         ) as specialization_name
                         FROM appointments 
                         JOIN users ON users.id = appointments.doctor_id
                         WHERE appointments.patient_id = ?
                         ${nameCondition(data.name)}
                         ${checkDateStatus(data.dateStatus)}
                         ${sort(data.sort, data.variant)}
                         LIMIT ?,?`;
      let appointments = await queryAsync(sql, [data.patientID, +data.offset, +data.count]);
      appointments = appointments.map((appointment) => {
        appointment.visit_date = appointment.visit_date.toLocaleString('ru', { hour12: false });
        return appointment;
      });
      return appointments;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
    finally {
      await connection.end();
    }
  }

  /**
   * get an appointments
   * @param {string} date
   * @param {string} doctorID
   * @returns {Promise<array>}appointments
   */
  async getAppointments(date, doctorID) {
    const connection = await createConnection();
    try {
      const queryAsync = promisify(connection.query).bind(connection);
      const sql = `SELECT * FROM appointments 
                         WHERE visit_date LIKE '%${date}%'
                         ${checkDoctorIDCondition(doctorID)}`;
      const appointments = await queryAsync(sql, [doctorID]);
      return appointments;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
    finally {
      await connection.end();
    }
  }

  /**
   * get an appointment data
   * @param {string} appointmentID
   * @returns {Promise<object>} appointment
   */
  async getAppointmentByID(appointmentID) {
    const connection = await createConnection();
    try {
      const queryAsync = promisify(connection.query).bind(connection);
      const sql = `SELECT * FROM appointments 
                         WHERE id = ?`;
      const [appointment] = await queryAsync(sql, [appointmentID]);
      return appointment;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
    finally {
      await connection.end();
    }
  }
}

export { AppointmentsRepository };
