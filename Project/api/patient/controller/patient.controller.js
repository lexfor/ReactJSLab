import { StatusCodes } from 'http-status-codes';
import RequestResult from '../../helpers/RequestResult';
import { ROLES_ID } from '../../../constants';

class PatientController {
  constructor(userService) {
    this.userService = userService;
  }

  /**
   * register new patient
   * @param {object} patient
   * @returns {Promise<object>} all founded patients with condition and status
   */
  async createPatient(patient) {
    const res = new RequestResult();
    try {
      const userData = {
        ...patient,
        role: ROLES_ID.PATIENT,
      };
      res.setValue = await this.userService.createUser(userData);
      res.setStatus = StatusCodes.CREATED;
      return res;
    } catch (e) {
      res.setValue = e.message;
      res.setStatus = e.status;
      return res;
    }
  }

  /**
   * delete patient
   * @param {string} patientID
   * @returns {Promise<object>} deleted patient id and status
   */
  async deletePatient(patientID) {
    const res = new RequestResult();
    try {
      res.setValue = await this.userService.deleteUser(patientID);
      res.setStatus = StatusCodes.ACCEPTED;
      return res;
    } catch (e) {
      res.setValue = e.message;
      res.setStatus = e.status;
      return res;
    }
  }

  /**
   * update patient
   * @param {string} patientID
   * @param {object} patient
   * @returns {Promise<object>} updated patient and status
   */
  async updatePatient(patientID, patient) {
    const res = new RequestResult();
    try {
      await this.userService.updateUser(patientID, patient);
      res.setValue = await this.userService.getUserByID(patientID, ROLES_ID.PATIENT);
      res.setStatus = StatusCodes.ACCEPTED;
      return res;
    } catch (e) {
      res.setValue = e.message;
      res.setStatus = e.status;
      return res;
    }
  }

  /**
   * get my profile
   * @param {string} userID
   * @returns {Promise<object>} patient and status
   */
  async getMyProfile(userID) {
    const res = new RequestResult();
    try {
      res.setValue = await this.userService.getUserByID(userID, ROLES_ID.PATIENT);
      res.setStatus = StatusCodes.OK;
      return res;
    } catch (e) {
      res.setValue = e.message;
      res.setStatus = e.status;
      return res;
    }
  }

  /**
   * Get all patients
   * @param {string} name
   * @returns {Promise<object>} all founded patients with condition and status
   */
  async getPatients(name) {
    const res = new RequestResult();
    try {
      res.setValue = await this.userService.getUsers(ROLES_ID.PATIENT, name);
      res.setStatus = StatusCodes.OK;
      return res;
    } catch (e) {
      res.setValue = e.message;
      res.setStatus = e.status;
      return res;
    }
  }
}

export { PatientController };
