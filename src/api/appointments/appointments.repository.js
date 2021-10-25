import { StatusCodes } from 'http-status-codes';
import ApiError from '../helpers/ApiError';
import { nameCondition, checkDoctorIDCondition, checkDateStatus } from '../helpers/conditions';
import { sort } from '../helpers/sort';
import {SPECIALIZATION_NAME_JOIN} from "../../constants";
import {changeTimeToLocal} from "../helpers/ChangeTimeToLocal";

class AppointmentsRepository {
  constructor(pool) {
    this.pool = pool;
  }

  /**
     * Create new appointment
     * @param {object} appointmentData
     * @returns {Promise<object>} appointment info
     */
  async createAppointment(appointmentData) {
    try {
      const sql = `INSERT INTO appointments (id, visit_date, reason, note, patient_id, doctor_id, status) VALUES (
                   $1, $2, $3, $4, $5, $6, $7)`;
      console.log(sql);
      await this.pool.query(sql, [
        appointmentData.id,
        appointmentData.visit_date,
        appointmentData.reason,
        appointmentData.note,
        appointmentData.patient_id,
        appointmentData.doctor_id,
        appointmentData.status]);
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
      const sql = 'DELETE FROM appointments WHERE id = $1';
      await this.pool.query(sql, [appointmentID]);
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
      const sql = 'UPDATE appointments SET status = $1 WHERE id = $2';
      await this.pool.query(sql, [statusID, appointmentID]);
      return appointmentID;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
     * get an appointments
     * @param {object} data
     * @returns {Promise<object>} appointments for doctor
     */
  async getAppointmentsForDoctor(data) {
    try {
      const sql = `
                         SELECT COUNT(*) OVER() as total,
                         appointments.*,
                         users.first_name, 
                         users.last_name, 
                         users.photo
                         FROM appointments 
                         JOIN users ON users.id = appointments.patient_id
                         WHERE appointments.doctor_id = $1
                         ${nameCondition(data.name)}
                         ${checkDateStatus(data.dateStatus)}
                         ${sort(data.sort, data.variant)}
                         LIMIT $3 OFFSET $2`;
      let { rows } =  await this.pool.query(sql, [data.doctorID, +data.offset, +data.count]);
      rows = changeTimeToLocal(rows);
      return rows;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
     * get an my appointments
     * @param {object} data
     * @returns {Promise<object>} appointments for patient
     */
  async getAppointmentsForPatient(data) {
    try {
      const sql = `
                         SELECT COUNT(*) OVER() as total,
                         appointments.*,
                         users.first_name,
                         users.last_name,
                         users.photo,
                         ${SPECIALIZATION_NAME_JOIN}
                         FROM appointments 
                         JOIN users ON users.id = appointments.doctor_id
                         WHERE appointments.patient_id = $1
                         ${nameCondition(data.name)}
                         ${checkDateStatus(data.dateStatus)}
                         ${sort(data.sort, data.variant)}
                         LIMIT $3 OFFSET $2`;
      let { rows } = await this.pool.query(sql, [data.patientID, +data.offset, +data.count]);
      rows = changeTimeToLocal(rows);
      return rows;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * get an appointments
   * @param {string} date
   * @param {string} doctorID
   * @returns {Promise<array>} appointments
   */
  async getAppointments(date, doctorID) {
    try {
      const sql = `SELECT * FROM appointments 
                         WHERE visit_date::text LIKE '%${date}%'
                         ${checkDoctorIDCondition(doctorID)}`;
      const { rows } = await this.pool.query(sql);
      return rows;
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
      const sql = `SELECT * FROM appointments 
                         WHERE id = $1`;
      const { rows }= await this.pool.query(sql, [appointmentID]);
      const [result] = rows;
      return result;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export { AppointmentsRepository };
