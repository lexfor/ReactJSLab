import RequestResult from '../../helpers/RequestResult';
import {ROLES, STATUSES} from '../../../constants';

class DoctorController {
  constructor(doctorServices, authService) {
    this.doctorServices = doctorServices;
    this.authService = authService;
  }

  /**
   * create new doctor
   * @param {object} doctor
   * @returns {Promise<object>} doctor and status
   */
  async createDoctor(doctor) {
    const res = new RequestResult();
    try {
      const createdUser = await this.authService.register(doctor, ROLES.DOCTOR);
      res.setValue = await this.doctorServices.createDoctor(doctor, createdUser);
      res.setStatus = STATUSES.OK;
      return res;
    } catch (e) {
      res.setValue = e.message;
      res.setStatus = e.status;
      return res;
    }
  }

  /**
   * delete doctor
   * @param {string} doctorID
   * @returns {Promise<object>} doctor ID and status
   */
  async deleteDoctor(doctorID) {
    const res = new RequestResult();
    try {
      const deletedDoctor = await this.doctorServices.deleteDoctor(doctorID);
      await this.authService.deleteUser(deletedDoctor.user_id);
      res.setValue = deletedDoctor.id;
      res.setStatus = STATUSES.OK;
      return res;
    } catch (e) {
      res.setValue = e.message;
      res.setStatus = e.status;
      return res;
    }
  }

  /**
   * update doctor
   * @param {string} doctorID
   * @param {object} doctor
   * @returns {Promise<object>} doctor and status
   */
  async updateDoctor(doctorID, doctor) {
    const res = new RequestResult();
    try {
      res.setValue = await this.doctorServices.updateDoctor(doctorID, doctor);
      res.setStatus = STATUSES.OK;
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
   * @param {object} doctor
   * @returns {Promise<object>} updated my doctor profile
   */
  async updateMyProfile(userID, doctor) {
    const res = new RequestResult();
    try {
      const foundedDoctor = await this.doctorServices.getDoctorByUserID(userID);
      res.setValue = await this.doctorServices.updateDoctor(foundedDoctor.id, doctor);
      res.setStatus = STATUSES.OK;
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
   * @returns {Promise<object>} doctor and status
   */
  async getMyProfile(userID) {
    const res = new RequestResult();
    try {
      res.setValue = await this.doctorServices.getDoctorByUserID(userID);
      res.setStatus = STATUSES.OK;
      return res;
    } catch (e) {
      res.setValue = e.message;
      res.setStatus = e.status;
      return res;
    }
  }

  /**
   * get all doctors
   * @param {string} specializationID
   * @returns {Promise<object>} doctors array and status
   */
  async getDoctors(specializationID) {
    const res = new RequestResult();
    try {
      res.setValue = await this.doctorServices.getDoctors(specializationID);
      res.setStatus = STATUSES.OK;
      return res;
    } catch (e) {
      res.setValue = e.message;
      res.setStatus = e.status;
      return res;
    }
  }
}

export { DoctorController };
