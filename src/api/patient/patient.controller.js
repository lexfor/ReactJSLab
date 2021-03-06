import { StatusCodes } from 'http-status-codes';
import RequestResult from '../helpers/RequestResult';
import { ROLES_ID, SORT_TYPE, SORTS } from '../../constants';
import APIMessage from "../helpers/APIMessage";

class PatientController {
  constructor(usersService) {
    this.usersService = usersService;
  }

  /**
   * register new patient
   * @param {object} patient
   * @param {string} userID
   * @returns {Promise<object>} patient and status
   */
  async createPatient(patient, userID) {
    const res = new RequestResult();
    try {
      const userData = {
        ...patient,
        role_id: ROLES_ID.PATIENT,
      };
      await this.usersService.checkIsAdmin(userID);
      await this.usersService.checkIsUserExist(userData.userName);
      const createdUser = await this.usersService.createUser(userData);
      res.setValue = await this.usersService.getUserByID(createdUser.id);
      res.setStatus = StatusCodes.CREATED;
      return res;
    } catch (e) {
      res.setValue = new APIMessage(e.message).message;
      if (e.status) {
        res.setStatus = e.status;
      } else {
        res.setStatus = StatusCodes.INTERNAL_SERVER_ERROR;
      }
      return res;
    }
  }

  /**
   * delete patient
   * @param {string} patientID
   * @param {string} userID
   * @returns {Promise<object>} deleted patient id and status
   */
  async deletePatient(patientID, userID) {
    const res = new RequestResult();
    try {
      await this.usersService.checkIsAdmin(userID);
      await this.usersService.checkIsPatientExist(patientID);
      res.setValue = await this.usersService.deleteUser(patientID);
      res.setStatus = StatusCodes.OK;
      return res;
    } catch (e) {
      res.setValue = new APIMessage(e.message).message;
      if (e.status) {
        res.setStatus = e.status;
      } else {
        res.setStatus = StatusCodes.INTERNAL_SERVER_ERROR;
      }
      return res;
    }
  }

  /**
   * update patient
   * @param {string} patientID
   * @param {object} patient
   * @param {string} userID
   * @returns {Promise<object>} updated patient and status
   */
  async updatePatient(patientID, patient, userID) {
    const res = new RequestResult();
    try {
      await this.usersService.checkIsAdmin(userID);
      await this.usersService.checkIsPatientExist(patientID);
      await this.usersService.updateUser(patientID, patient);
      res.setValue = await this.usersService.getUserByID(patientID, ROLES_ID.PATIENT);
      res.setStatus = StatusCodes.OK;
      return res;
    } catch (e) {
      res.setValue = new APIMessage(e.message).message;
      if (e.status) {
        res.setStatus = e.status;
      } else {
        res.setStatus = StatusCodes.INTERNAL_SERVER_ERROR;
      }
      return res;
    }
  }

  /**
   * update patient
   * @param {string} patientID
   * @param {object} patient
   * @returns {Promise<object>} updated patient and status
   */
  async updateMyProfile(patientID, patient) {
    const res = new RequestResult();
    try {
      await this.usersService.checkIsPatient(patientID);
      await this.usersService.checkIsPatientExist(patientID);
      await this.usersService.updateUser(patientID, patient);
      res.setValue = await this.usersService.getUserByID(patientID, ROLES_ID.PATIENT);
      res.setStatus = StatusCodes.OK;
      return res;
    } catch (e) {
      res.setValue = new APIMessage(e.message).message;
      if (e.status) {
        res.setStatus = e.status;
      } else {
        res.setStatus = StatusCodes.INTERNAL_SERVER_ERROR;
      }
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
      await this.usersService.checkIsPatient(patientID);
      await this.usersService.checkIsPatientExist(patientID);
      res.setValue = await this.usersService.getUserByID(patientID);
      res.setStatus = StatusCodes.OK;
      return res;
    } catch (e) {
      res.setValue = new APIMessage(e.message).message;
      if (e.status) {
        res.setStatus = e.status;
      } else {
        res.setStatus = StatusCodes.INTERNAL_SERVER_ERROR;
      }
      return res;
    }
  }

  /**
   * Get all patients
   * @param {object} data
   * @param {string} userID
   * @returns {Promise<object>} all founded patients with condition and status
   */
  async getPatients(data, userID) {
    const res = new RequestResult();
    try {
      const patientData = {
        ...data,
        sort: SORTS[data.sort],
        variant: SORT_TYPE[data.variant],
        role: ROLES_ID.PATIENT,
      };
      await this.usersService.checkIsAdmin(userID);
      res.setValue = await this.usersService.getUsers(patientData);
      res.setStatus = StatusCodes.OK;
      return res;
    } catch (e) {
      res.setValue = new APIMessage(e.message).message;
      if (e.status) {
        res.setStatus = e.status;
      } else {
        res.setStatus = StatusCodes.INTERNAL_SERVER_ERROR;
      }
      return res;
    }
  }
}

export { PatientController };
