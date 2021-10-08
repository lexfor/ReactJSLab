import RequestResult from '../../helpers/RequestResult';
import {ROLES, STATUSES} from '../../../constants';

class PatientController {
  constructor(patientService, authService) {
    this.patientService = patientService;
    this.authService = authService;
  }

  /**
   * register new patient
   * @param {object} user
   * @returns {Promise<object>} all founded patients with condition and status
   */
  async registerPatient(user) {
    const res = new RequestResult();
    try {
      console.log(user);
      const createdUser = await this.authService.register(user, ROLES.PATIENT);
      const createdPatient = await this.patientService.createPatient(user, createdUser);
      res.setValue = createdPatient.id;
      res.setStatus = STATUSES.CREATED;
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
      const deletedPatient = await this.patientService.deletePatient(patientID);
      await this.authService.deleteUser(deletedPatient.user_id);
      res.setValue = deletedPatient.id;
      res.setStatus = STATUSES.ACCEPTED;
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
      await this.patientService.updatePatient(patientID, patient);
      res.setValue = await this.patientService.getPatientByID(patientID);
      res.setStatus = STATUSES.ACCEPTED;
      return res;
    } catch (e) {
      res.setValue = e.message;
      res.setStatus = e.status;
      return res;
    }
  }

  /**
   * update my profile
   * @param {string} userID
   * @param {object} newPatientData
   * @returns {Promise<object>} updated patient and status
   */
  async updateMyProfile(userID, newPatientData) {
    const res = new RequestResult();
    try {
      const patient = await this.patientService.getPatientByUser(userID);
      await this.patientService.updatePatient(patient.id, newPatientData);
      res.setValue = await this.patientService.getPatientByID(patient.id);
      res.setStatus = STATUSES.ACCEPTED;
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
      res.setValue = await this.patientService.getPatientByUser(userID);
      res.setStatus = STATUSES.ACCEPTED;
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
      res.setValue = await this.patientService.getPatients(name);
      res.setStatus = STATUSES.OK;
      return res;
    } catch (e) {
      res.setValue = e.message;
      res.setStatus = e.status;
      return res;
    }
  }
}

export { PatientController };
