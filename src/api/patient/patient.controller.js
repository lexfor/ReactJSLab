import { StatusCodes } from 'http-status-codes';
import RequestResult from '../helpers/RequestResult';
import { ROLES_ID } from '../../constants';

class PatientController {
  constructor(usersService) {
    this.usersService = usersService;
  }

  /**
   * register new patient
   * @param {object} patient
   * @returns {Promise<object>} patient and status
   */
  async createPatient(patient) {
    const res = new RequestResult();
    try {
      const userData = {
        ...patient,
        role_id: ROLES_ID.PATIENT,
      };
      await this.usersService.checkIsUserExist(userData.login, ROLES_ID.PATIENT);
      res.setValue = await this.usersService.createUser(userData);
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
      await this.usersService.checkIsPatientExist(patientID);
      res.setValue = await this.usersService.deleteUser(patientID);
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
      await this.usersService.checkIsPatientExist(patientID);
      await this.usersService.updateUser(patientID, patient);
      res.setValue = await this.usersService.getUserByID(patientID, ROLES_ID.PATIENT);
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
   * @param {string} patientID
   * @returns {Promise<object>} patient and status
   */
  async getMyProfile(patientID) {
    const res = new RequestResult();
    try {
      await this.usersService.checkIsPatientExist(patientID);
      res.setValue = await this.usersService.getUserByID(patientID);
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
   * @param {object} data
   * @returns {Promise<object>} all founded patients with condition and status
   */
  async getPatients(data) {
    const res = new RequestResult();
    try {
      const patientData = {
        ...data,
        role: ROLES_ID.PATIENT,
      };
      res.setValue = await this.usersService.getUsers(patientData);
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
