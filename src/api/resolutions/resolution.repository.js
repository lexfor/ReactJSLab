import { promisify } from 'util';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../helpers/ApiError';
import { nameCondition } from '../helpers/conditions';
import { dateCondition } from '../helpers/conditions/dateCondition';
import { sort } from '../helpers/sort';

class ResolutionRepository {
  constructor(connection) {
    this.connection = connection;
  }

  /**
   * Create new resolution
   * @param {object} data
   * @returns {Promise<object>} resolution data
   */
  async createResolution(data) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'INSERT INTO resolutions SET ? ';
      await queryAsync(sql, data);
      return data;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
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
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = `UPDATE resolutions 
                   SET value = ? WHERE resolutions.id = ?`;
      await queryAsync(sql, [resolutionValue, resolutionID]);
      return resolutionID;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Delete resolution
   * @param {string} resolutionID
   * @returns {Promise<object>} resolution data
   */
  async deleteResolution(resolutionID) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'DELETE FROM resolutions WHERE id = ?';
      await queryAsync(sql, [resolutionID]);
      return resolutionID;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * get resolution by ID
   * @param {string} resolutionID
   * @returns {Promise<object>} resolution data
   */
  async getResolutionByID(resolutionID) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = `SELECT resolutions.*, appointments.doctor_id FROM resolutions 
                   INNER JOIN appointments ON appointments.id = resolutions.appointment_id
                   WHERE resolutions.id = ?`;
      const [resolution] = await queryAsync(sql, [resolutionID]);
      return resolution;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * get resolution by Appointment ID
   * @param {string} appointmentID
   * @returns {Promise<object>} resolution data
   */
  async getResolutionByAppointmentID(appointmentID) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = `SELECT resolutions.*, appointments.doctor_id FROM resolutions 
                   INNER JOIN appointments ON appointments.id = resolutions.appointment_id
                   WHERE appointments.id = ?`;
      const [resolution] = await queryAsync(sql, [appointmentID]);
      return resolution;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get resolutions
   * @param {object} data
   * @returns {Promise<array>} resolution data
   */
  async getResolutions(data) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = `SELECT COUNT(*) OVER() as total,
                   resolutions.*,
                   appointments.visit_date, 
                   users.first_name, 
                   users.last_name,
                   (
                     SELECT GROUP_CONCAT(specializations.specialization_name SEPARATOR ', ') FROM specializations
                     INNER JOIN doctors_specializations ON specializations.id = doctors_specializations.specialization_id
                     WHERE users.id = doctors_specializations.doctor_id
                   ) as specialization_name
                   FROM resolutions
                   INNER JOIN appointments ON appointments.id = resolutions.appointment_id
                   INNER JOIN users ON appointments.doctor_id = users.id
                   WHERE appointments.patient_id = ?
                   ${nameCondition(data.name)}
                   ${sort(data.sort, data.variant)}
                   LIMIT ?,?`;
      let resolutions = await queryAsync(sql, [data.patientID, +data.offset, +data.count]);
      resolutions = resolutions.map((resolution) => {
        resolution.visit_date = resolution.visit_date.toLocaleString();
        resolution.next_appointment_date = resolution.next_appointment_date.toLocaleString();
        return resolution;
      });
      return resolutions;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get resolutions
   * @param {object} data
   * @returns {Promise<array>} resolution data
   */
  async getMyResolutions(data) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = `SELECT COUNT(*) OVER() as total,
                   resolutions.*, appointments.visit_date, users.first_name, users.last_name FROM resolutions
                   INNER JOIN appointments ON appointments.id = resolutions.appointment_id
                   INNER JOIN users ON appointments.patient_id = users.id
                   WHERE appointments.doctor_id = ?
                   ${dateCondition(data.date)}
                   ${nameCondition(data.name)}
                   ${sort(data.sort, data.variant)}
                   LIMIT ?,?`;
      let resolutions = await queryAsync(sql, [data.doctorID, +data.offset, +data.count]);
      resolutions = resolutions.map((resolution) => {
        resolution.visit_date = resolution.visit_date.toLocaleString();
        resolution.next_appointment_date = resolution.next_appointment_date.toLocaleString();
        return resolution;
      });
      return resolutions;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get resolutions
   * @param {object} data
   * @returns {Promise<array>} resolution data
   */
  async getPatientResolutionsByDoctorSpecializationID(data) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = `SELECT COUNT(*) OVER() as total,
                   resolutions.*,
                   appointments.visit_date, 
                   users.first_name, 
                   users.last_name,
                   specializations.specialization_name
                   FROM resolutions
                   INNER JOIN appointments ON appointments.id = resolutions.appointment_id
                   INNER JOIN users ON appointments.doctor_id = users.id
                   INNER JOIN doctors_specializations ON doctors_specializations.doctor_id = users.id
                   INNER JOIN specializations ON doctors_specializations.specialization_id = specializations.id
                   WHERE appointments.patient_id = ?
                   AND specializations.id = ?
                   ${nameCondition(data.name)}
                   ${sort(data.sort, data.variant)}
                   LIMIT ?,?`;
      let resolutions = await queryAsync(
        sql,
        [data.patientID, data.specializationID, +data.offset, +data.count],
      );
      resolutions = resolutions.map((resolution) => {
        resolution.visit_date = resolution.visit_date.toLocaleString();
        resolution.next_appointment_date = resolution.next_appointment_date.toLocaleString();
        return resolution;
      });
      return resolutions;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get resolutions
   * @param {object} data
   * @returns {Promise<array>} resolution data
   */
  async getPatientResolutionsByDate(data) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = `SELECT COUNT(*) OVER() as total,
                   resolutions.*,
                   appointments.visit_date, 
                   users.first_name, 
                   users.last_name,
                   (
                     SELECT GROUP_CONCAT(specializations.specialization_name SEPARATOR ', ') FROM specializations
                     INNER JOIN doctors_specializations ON specializations.id = doctors_specializations.specialization_id
                     WHERE users.id = doctors_specializations.doctor_id
                   ) as specialization_name
                   FROM resolutions
                   INNER JOIN appointments ON appointments.id = resolutions.appointment_id
                   INNER JOIN users ON appointments.doctor_id = users.id
                   WHERE appointments.patient_id = ?
                   ${dateCondition(data.date)}
                   ${nameCondition(data.name)}
                   ${sort(data.sort, data.variant)}
                   LIMIT ?,?`;
      let resolutions = await queryAsync(
        sql,
        [data.patientID, data.specializationID, +data.offset, +data.count],
      );
      resolutions = resolutions.map((resolution) => {
        resolution.visit_date = resolution.visit_date.toLocaleString();
        resolution.next_appointment_date = resolution.next_appointment_date.toLocaleString();
        return resolution;
      });
      return resolutions;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export { ResolutionRepository };
