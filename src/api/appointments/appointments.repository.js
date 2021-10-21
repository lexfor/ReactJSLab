import { promisify } from 'util';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../helpers/ApiError';
import { nameCondition, checkDoctorIDCondition, checkDateStatus } from '../helpers/conditions';
import { sort } from '../helpers/sort';
import {createConnection} from "../helpers/DBconnection";
import {SPECIALIZATION_NAME_JOIN} from "../../constants";
import {changeTimeToLocal} from "../helpers/ChangeTimeToLocal";

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
     * @returns {Promise<object>} appointments for doctor
     */
  async getAppointmentsForDoctor(data) {
    const connection = await createConnection();
    try {
      const queryAsync = promisify(connection.query).bind(connection);
      const sql = `
                         SELECT SQL_CALC_FOUND_ROWS(appointments.id),
                         appointments.*,
                         users.first_name, 
                         users.last_name, 
                         users.photo
                         FROM appointments 
                         JOIN users ON users.id = appointments.patient_id
                         WHERE appointments.doctor_id = ?
                         ${nameCondition(data.name)}
                         ${checkDateStatus(data.dateStatus)}
                         ${sort(data.sort, data.variant)}
                         LIMIT ?,?`;
      let appointments = await queryAsync(sql, [data.doctorID, +data.offset, +data.count]);
      appointments = changeTimeToLocal(appointments);
      const result = {
        appointments,
        total: await this.getCount(connection),
      }
      return result;
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
     * @returns {Promise<object>} appointments for patient
     */
  async getAppointmentsForPatient(data) {
    const connection = await createConnection();
    try {
      const queryAsync = promisify(connection.query).bind(connection);
      const sql = `
                         SELECT SQL_CALC_FOUND_ROWS(appointments.id),
                         appointments.*,
                         users.first_name,
                         users.last_name,
                         users.photo,
                         ${SPECIALIZATION_NAME_JOIN}
                         FROM appointments 
                         JOIN users ON users.id = appointments.doctor_id
                         WHERE appointments.patient_id = ?
                         ${nameCondition(data.name)}
                         ${checkDateStatus(data.dateStatus)}
                         ${sort(data.sort, data.variant)}
                         LIMIT ?,?`;
      let appointments = await queryAsync(sql, [data.patientID, +data.offset, +data.count]);
      appointments = changeTimeToLocal(appointments);
      const result = {
        appointments,
        total: await this.getCount(connection),
      }
      return result;
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
   * @returns {Promise<array>} appointments
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

  /**
   * get an results count
   * @returns {Promise<number>} total number
   */
  async getCount(connection) {
    try {
      const queryAsync = promisify(connection.query).bind(connection);
      const sql = `SELECT FOUND_ROWS() as total`;
      const [total] = await queryAsync(sql);
      return total.total;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export { AppointmentsRepository };
