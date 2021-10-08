import { promisify } from 'util';
import { v1 as uuidv1 } from 'uuid';
import ApiError from '../../helpers/ApiError';
import { STATUSES } from '../../../constants';

class PatientRepository {
  constructor(connection) {
    this.connection = connection;
  }

  /**
   * Create new patient
   * @param {object} patientData
   * @returns {Promise<object>} patient Data
   */
  async createPatient(patientData) {
    try {
      const uuid = uuidv1();
      const data = { id: uuid, ...patientData };
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'INSERT INTO patients SET ?';
      await queryAsync(sql, data);
      return data;
    } catch (e) {
      throw new ApiError(e.message, STATUSES.SERVER_ERROR);
    }
  }

  /**
   * Get patient by ID
   * @param {string} patientID
   * @returns {Promise<object>} founded patient
   */
  async getPatientByID(patientID) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'SELECT * FROM patients WHERE id = ?';
      const result = await queryAsync(sql, patientID);
      return result[0];
    } catch (e) {
      throw new ApiError(e.message, STATUSES.SERVER_ERROR);
    }
  }

  /**
   * Get patient by user ID
   * @param {string} userID
   * @returns {Promise<object>} founded patient
   */
  async getPatientByUserID(userID) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'SELECT * FROM patients WHERE user_id = ?';
      const result = await queryAsync(sql, userID);
      return result[0];
    } catch (e) {
      throw new ApiError(e.message, STATUSES.SERVER_ERROR);
    }
  }

  /**
   * Delete patient by ID
   * @param {string} patientID
   * @returns {Promise<object>} deleted patient ID
   */
  async deletePatient(patientID) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'DELETE FROM patients WHERE id = ?';
      await queryAsync(sql, patientID);
      return patientID;
    } catch (e) {
      throw new ApiError(e.message, STATUSES.SERVER_ERROR);
    }
  }

  /**
   * Update patient
   * @param {string} patientID
   * @param {object} patient
   * @returns {Promise<object>} updated patient ID
   */
  async updatePatient(patientID, patient) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'UPDATE patients SET first_name = ?, last_name = ? WHERE id = ?';
      await queryAsync(sql, [patient.firstName, patient.lastName, patientID]);
      return patientID;
    } catch (e) {
      console.log(e);
      throw new ApiError(e.message, STATUSES.SERVER_ERROR);
    }
  }


  /**
   * Get patients
   * @param {string} name
   * @returns {Promise<array>} founded patients
   */
  async getPatients(name) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      let condition = '';
      if (name) {
        condition = ` WHERE last_name LIKE '%${name}%' OR first_name LIKE '%${name}%'`
      }
      const sql = `
      SELECT * 
      FROM patients` + condition;
      const result = await queryAsync(sql);
      return result;
    } catch (e) {
      throw new ApiError(e.message, STATUSES.SERVER_ERROR);
    }
  }
}

export { PatientRepository };
