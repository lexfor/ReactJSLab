import { StatusCodes } from 'http-status-codes';
import ApiError from '../helpers/ApiError';
import { nameCondition } from '../helpers/conditions';
import { dateCondition } from '../helpers/conditions/dateCondition';
import { sort } from '../helpers/sort';
import {DOCTOR_JOIN, PATIENT_JOIN, SPECIALIZATION_NAME_JOIN} from '../../constants';
import { changeTimeToLocal } from '../helpers/ChangeTimeToLocal';
import {doctorParse} from "../helpers/doctorParse";
import {patientParse} from "../helpers/patientParse";

class ResolutionRepository {
  constructor(pool) {
    this.pool = pool;
  }

  /**
   * Create new resolution
   * @param {object} data
   * @returns {Promise<object>} resolution data
   */
  async createResolution(data) {
    try {
      const sql = `INSERT INTO resolutions (id, resolution, appointment_id, next_appointment_date) VALUES (
                   $1, $2, $3, $4) `;
      await this.pool.query(sql, [
          data.id,
          data.resolution,
          data.appointment_id,
          data.next_appointment_date,
      ]);
      return data;
    } catch (e) {
      console.log(e.message);
      throw new ApiError('SQL error', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Update resolution
   * @param {string} resolutionID
   * @param {string} resolutionValue
   * @returns {Promise<string>} resolution data
   */
  async updateResolution(resolutionID, resolutionValue) {
    try {
      const sql = `UPDATE resolutions 
                   SET resolution = $1 WHERE resolutions.id = $2`;
      await this.pool.query(sql, [resolutionValue, resolutionID]);
      return resolutionID;
    } catch (e) {
      console.log(e.message);
      throw new ApiError('SQL error', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Delete resolution
   * @param {string} resolutionID
   * @returns {Promise<object>} resolution data
   */
  async deleteResolution(resolutionID) {
    try {
      const sql = 'DELETE FROM resolutions WHERE id = $1';
      await this.pool.query(sql, [resolutionID]);
      return resolutionID;
    } catch (e) {
      console.log(e.message);
      throw new ApiError('SQL error', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * get resolution by ID
   * @param {string} resolutionID
   * @returns {Promise<object>} resolution data
   */
  async getResolutionByID(resolutionID) {
    try {
      const sql = `SELECT resolutions.*, appointments.doctor_id FROM resolutions 
                   INNER JOIN appointments ON appointments.id = resolutions.appointment_id
                   WHERE resolutions.id = $1`;
      let { rows } = await this.pool.query(sql, [resolutionID]);
      console.log(rows);
      rows = changeTimeToLocal(rows);
      const [result] = rows;
      return result;
    } catch (e) {
      console.log(e.message);
      throw new ApiError('SQL error', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * get resolution by Appointment ID
   * @param {string} appointmentID
   * @returns {Promise<object>} resolution data
   */
  async getResolutionByAppointmentID(appointmentID) {
    try {
      const sql = `SELECT resolutions.*, appointments.doctor_id FROM resolutions 
                   INNER JOIN appointments ON appointments.id = resolutions.appointment_id
                   WHERE appointments.id = $1`;
      let { rows } = await this.pool.query(sql, [appointmentID]);
      console.log(rows);
      rows = changeTimeToLocal(rows);
      const [result] = rows;
      return result;
    } catch (e) {
      console.log(e.message);
      throw new ApiError('SQL error', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get resolutions
   * @param {object} data
   * @returns {Promise<object>} resolution data
   */
  async getResolutionsForPatient(data) {
    try {
      const sql = `
                   SELECT COUNT(*) OVER() as total,
                   resolutions.*,
                   appointments.visit_date, 
                   ${DOCTOR_JOIN}
                   FROM resolutions
                   INNER JOIN appointments ON appointments.id = resolutions.appointment_id
                   INNER JOIN users ON appointments.doctor_id = users.id
                   WHERE appointments.patient_id = $1
                   ${nameCondition(data.name)}
                   ${sort(data.sort, data.variant)}
                   LIMIT $3 OFFSET $2`;
      let { rows } = await this.pool.query(sql, [data.patientID, +data.offset, +data.count]);
      rows = doctorParse(rows);
      rows = changeTimeToLocal(rows);
      return rows;
    } catch (e) {
      console.log(e.message);
      throw new ApiError('SQL error', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get resolutions
   * @param {object} data
   * @returns {Promise<object>} resolution data
   */
  async getResolutionsForDoctor(data) {
    try {
      const sql = `
                   SELECT COUNT(*) OVER() as total,
                   resolutions.*,
                   appointments.visit_date, 
                   ${PATIENT_JOIN}
                   FROM resolutions
                   INNER JOIN appointments ON appointments.id = resolutions.appointment_id
                   INNER JOIN users ON appointments.patient_id = users.id
                   WHERE appointments.doctor_id = $1
                   ${dateCondition(data.date)}
                   ${nameCondition(data.name)}
                   ${sort(data.sort, data.variant)}
                   LIMIT $3 OFFSET $2`;
      let { rows } = await this.pool.query(sql, [data.doctorID, +data.offset, +data.count]);
      rows = patientParse(rows);
      rows = changeTimeToLocal(rows);
      return rows;
    } catch (e) {
      console.log(e.message);
      throw new ApiError('SQL error', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get resolutions
   * @param {object} data
   * @returns {Promise<object>} resolution data
   */
  async getPatientResolutionsByDoctorSpecializationID(data) {
    try {
      const sql = `
                   SELECT COUNT(*) OVER() as total,
                   resolutions.*,
                   appointments.visit_date, 
                   (users.first_name, users.last_name, users.photo, users.id, specializations.specialization_name) as doctor
                   FROM resolutions
                   INNER JOIN appointments ON appointments.id = resolutions.appointment_id
                   INNER JOIN users ON appointments.doctor_id = users.id
                   INNER JOIN doctors_specializations ON doctors_specializations.doctor_id = users.id
                   INNER JOIN specializations ON doctors_specializations.specialization_id = specializations.id
                   WHERE appointments.patient_id = $1
                   AND specializations.id = $2
                   ${nameCondition(data.name)}
                   ${sort(data.sort, data.variant)}
                   LIMIT $4 OFFSET $3`;
      let { rows } = await this.pool.query(
        sql,
        [data.patientID, data.specializationID, +data.offset, +data.count],
      );
      rows = doctorParse(rows);
      rows = changeTimeToLocal(rows);
      return rows;
    } catch (e) {
      console.log(e.message);
      throw new ApiError('SQL error', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get resolutions
   * @param {object} data
   * @returns {Promise<object>} resolution data
   */
  async getPatientResolutionsByDate(data) {
    try {
      const sql = `
                   SELECT COUNT(*) OVER() as total,
                   resolutions.*,
                   appointments.visit_date, 
                   ${DOCTOR_JOIN}
                   FROM resolutions
                   INNER JOIN appointments ON appointments.id = resolutions.appointment_id
                   INNER JOIN users ON appointments.doctor_id = users.id
                   WHERE appointments.patient_id = $1
                   ${dateCondition(data.date)}
                   ${nameCondition(data.name)}
                   ${sort(data.sort, data.variant)}
                   LIMIT $3 OFFSET $2`;
      let { rows } = await this.pool.query(
        sql,
        [data.patientID, +data.offset, +data.count],
      );
      rows = doctorParse(rows);
      rows = changeTimeToLocal(rows);
      return rows;
    } catch (e) {
      console.log(e.message);
      throw new ApiError('SQL error', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export { ResolutionRepository };
