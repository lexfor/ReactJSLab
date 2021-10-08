import ApiError from '../../helpers/ApiError';

import { STATUSES } from '../../../constants';

class PatientService {
  constructor(patientRepository) {
    this.patientRepository = patientRepository;
  }

  /**
   * Add new patient
   * @param {object} user
   * @param {object} createdUser
   * @returns {Promise<object>} patient Data
   */
  async createPatient(user, createdUser) {
    const patientData = {
      user_id: createdUser.id,
      first_name: user.firstName,
      last_name: user.lastName,
    };
    const patient = await this.patientRepository.createPatient(patientData);
    return patient;
  }

  /**
   * delete patient
   * @param {string} patientID
   * @returns {Promise<object>} deleted patient
   */
  async deletePatient(patientID) {
    const patient = await this.patientRepository.getPatientByID(patientID);
    await this.patientRepository.deletePatient(patientID);
    return patient;
  }

  /**
   * update patient
   * @param {string} patientID
   * @param {object} patient
   * @returns {Promise<object>} updated patient
   */
  async updatePatient(patientID, patient) {
    await this.patientRepository.updatePatient(patientID, patient);
    const updatedPatient = await this.patientRepository.getPatientByID(patientID);
    return updatedPatient;
  }

  /**
   * Find patient by user ID
   * @param {string} userID
   * @returns {Promise<object>} patient Data
   */
  async getPatientByUser(userID) {
    const patient = await this.patientRepository.getPatientByUserID(userID);
    return patient;
  }

  /**
   * Find patient by ID
   * @param {string} patientID
   * @returns {Promise<object>} patient Data
   */
  async getPatientByID(patientID) {
    const patient = await this.patientRepository.getPatientByID(patientID);
    return patient;
  }

  /**
   * Check is exist patient by name, user ID, ID
   * @param {string} patientID name or ID or user ID
   */
  async isExist(patientID) {
    const foundedPatient = await this.patientRepository.getPatientByID(patientID);
    if (!foundedPatient) {
      throw new ApiError('no such patient', STATUSES.NOT_FOUND);
    }
  }

  /**
   * Get all patients by part of data
   * @param {string} name
   * @returns {Promise<array>} founded patients
   */
  async getPatients( name) {
    const allPatient = await this.patientRepository.getPatients(name);

    return allPatient || null;
  }
}

export { PatientService };
