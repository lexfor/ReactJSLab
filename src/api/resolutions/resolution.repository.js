import { promisify } from 'util';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../helpers/ApiError';
import { nameCondition } from '../helpers/conditions';
import { dateCondition } from '../helpers/conditions/dateCondition';
import { sort } from '../helpers/sort';
import {createConnection} from "../helpers/DBconnection";

class ResolutionRepository {

  /**
   * Create new resolution
   * @param {object} data
   * @returns {Promise<object>} resolution data
   */
  async createResolution(data) {
    const connection = await createConnection();
    try {
      const queryAsync = promisify(connection.query).bind(connection);
      const sql = 'INSERT INTO resolutions SET ? ';
      await queryAsync(sql, data);
      return data;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
    finally {
      await connection.end();
    }
  }

  /**
   * Update resolution
   * @param {string} resolutionID
   * @param {string} resolutionValue
   * @returns {Promise<string>} resolution data
   */
  async updateResolution(resolutionID, resolutionValue) {
    const connection = await createConnection();
    try {
      const queryAsync = promisify(connection.query).bind(connection);
      const sql = `UPDATE resolutions 
                   SET value = ? WHERE resolutions.id = ?`;
      await queryAsync(sql, [resolutionValue, resolutionID]);
      return resolutionID;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
    finally {
      await connection.end();
    }
  }

  /**
   * Delete resolution
   * @param {string} resolutionID
   * @returns {Promise<object>} resolution data
   */
  async deleteResolution(resolutionID) {
    const connection = await createConnection();
    try {
      const queryAsync = promisify(connection.query).bind(connection);
      const sql = 'DELETE FROM resolutions WHERE id = ?';
      await queryAsync(sql, [resolutionID]);
      return resolutionID;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
    finally {
      await connection.end();
    }
  }

  /**
   * get resolution by ID
   * @param {string} resolutionID
   * @returns {Promise<object>} resolution data
   */
  async getResolutionByID(resolutionID) {
    const connection = await createConnection();
    try {
      const queryAsync = promisify(connection.query).bind(connection);
      const sql = `SELECT resolutions.*, appointments.doctor_id FROM resolutions 
                   INNER JOIN appointments ON appointments.id = resolutions.appointment_id
                   WHERE resolutions.id = ?`;
      const [resolution] = await queryAsync(sql, [resolutionID]);
      return resolution;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
    finally {
      await connection.end();
    }
  }

  /**
   * get resolution by Appointment ID
   * @param {string} appointmentID
   * @returns {Promise<object>} resolution data
   */
  async getResolutionByAppointmentID(appointmentID) {
    const connection = await createConnection();
    try {
      const queryAsync = promisify(connection.query).bind(connection);
      const sql = `SELECT resolutions.*, appointments.doctor_id FROM resolutions 
                   INNER JOIN appointments ON appointments.id = resolutions.appointment_id
                   WHERE appointments.id = ?`;
      const [resolution] = await queryAsync(sql, [appointmentID]);
      return resolution;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
    finally {
      await connection.end();
    }
  }

  /**
   * Get resolutions
   * @param {object} data
   * @returns {Promise<array>} resolution data
   */
  async getResolutions(data) {
    const connection = await createConnection();
    try {
      const queryAsync = promisify(connection.query).bind(connection);
      const sql = `SELECT SQL_CALC_FOUND_ROWS(resolutions.id),
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
        resolution.visit_date = resolution.visit_date.toLocaleString('ru', { hour12: false });
        resolution.next_appointment_date = resolution.next_appointment_date.toLocaleString('ru', { hour12: false });
        return resolution;
      });
      return resolutions;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
    finally {
      await connection.end();
    }
  }

  /**
   * Get resolutions
   * @param {object} data
   * @returns {Promise<array>} resolution data
   */
  async getMyResolutions(data) {
    const connection = await createConnection();
    try {
      const queryAsync = promisify(connection.query).bind(connection);
      const sql = `SELECT SQL_CALC_FOUND_ROWS(resolutions.id),
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
        resolution.visit_date = resolution.visit_date.toLocaleString('ru', { hour12: false });
        resolution.next_appointment_date = resolution.next_appointment_date.toLocaleString('ru', { hour12: false });
        return resolution;
      });
      return resolutions;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
    finally {
      await connection.end();
    }
  }

  /**
   * Get resolutions
   * @param {object} data
   * @returns {Promise<array>} resolution data
   */
  async getPatientResolutionsByDoctorSpecializationID(data) {
    const connection = await createConnection();
    try {
      const queryAsync = promisify(connection.query).bind(connection);
      const sql = `SELECT SQL_CALC_FOUND_ROWS(resolutions.id),
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
        resolution.visit_date = resolution.visit_date.toLocaleString('ru', { hour12: false });
        resolution.next_appointment_date = resolution.next_appointment_date.toLocaleString('ru', { hour12: false });
        return resolution;
      });
      return resolutions;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
    finally {
      await connection.end();
    }
  }

  /**
   * Get resolutions
   * @param {object} data
   * @returns {Promise<array>} resolution data
   */
  async getPatientResolutionsByDate(data) {
    const connection = await createConnection();
    try {
      const queryAsync = promisify(connection.query).bind(connection);
      const sql = `SELECT SQL_CALC_FOUND_ROWS(resolutions.id),
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
        [data.patientID, +data.offset, +data.count],
      );
      resolutions = resolutions.map((resolution) => {
        resolution.visit_date = resolution.visit_date.toLocaleString('ru', { hour12: false });
        resolution.next_appointment_date = resolution.next_appointment_date.toLocaleString('ru', { hour12: false });
        return resolution;
      });
      return resolutions;
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
  async getCount() {
    const connection = await createConnection();
    try {
      const queryAsync = promisify(connection.query).bind(connection);
      const sql = `SELECT FOUND_ROWS() as total`;
      const [total] = await queryAsync(sql);
      return total.total;
    } catch (e) {
      throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
    finally {
      await connection.end();
    }
  }
}

export { ResolutionRepository };
