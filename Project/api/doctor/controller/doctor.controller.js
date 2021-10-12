import { StatusCodes } from 'http-status-codes';
import RequestResult from '../../helpers/RequestResult';
import { ROLES_ID } from '../../../constants';

class DoctorController {
  constructor(doctorServices, usersService) {
    this.doctorServices = doctorServices;
    this.usersService = usersService;
  }

  /**
   * create new doctor
   * @param {object} doctor
   * @returns {Promise<object>} doctor and status
   */
  async createDoctor(doctor) {
    const res = new RequestResult();
    try {
      const userData = {
        ...doctor,
        role: ROLES_ID.DOCTOR,
      };
      const user = await this.usersService.createUser(userData);
      await this.doctorServices.createDoctor(doctor, user);
      res.setValue = user;
      res.setStatus = StatusCodes.CREATED;
      return res;
    } catch (e) {
      res.setValue = e.message;
      res.setStatus = e.status;
      return res;
    }
  }

  /**
   * delete doctor
   * @param {string} userID
   * @returns {Promise<object>} doctor ID and status
   */
  async deleteDoctor(userID) {
    const res = new RequestResult();
    try {
      await this.usersService.deleteUser(userID);
      await this.doctorServices.deleteDoctor(userID);
      res.setValue = userID;
      res.setStatus = StatusCodes.ACCEPTED;
      return res;
    } catch (e) {
      res.setValue = e.message;
      res.setStatus = e.status;
      return res;
    }
  }

  /**
   * update doctor
   * @param {string} userID
   * @param {object} doctor
   * @returns {Promise<object>} doctor and status
   */
  async updateDoctor(userID, doctor) {
    const res = new RequestResult();
    try {
      const result = await this.usersService.updateUser(userID, doctor);
      await this.doctorServices.updateDoctor(userID, doctor);
      res.setValue = result;
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
   * @returns {Promise<object>} doctor and status
   */
  async getMyProfile(userID) {
    const res = new RequestResult();
    try {
      const user = await this.usersService.getUserByID(userID);
      user.specializationName = await this.doctorServices.getDoctorSpecializations(userID, '');
      res.setValue = user;
      res.setStatus = StatusCodes.OK;
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
   * @param {string} name
   * @returns {Promise<object>} doctors array and status
   */
  async getDoctors(specializationID, name) {
    const res = new RequestResult();
    try {
      const users = await this.usersService.getUsers(ROLES_ID.DOCTOR, name);
      const result = users.map(async (user) => {
        user.specializationName = await this.doctorServices.getDoctorSpecializations(
          user.id,
          specializationID,
        );
        console.log(user);
        if (user.specializationName) {
          return user;
        }
      });
      res.setValue = await Promise.all(result);
      res.setStatus = StatusCodes.OK;
      return res;
    } catch (e) {
      res.setValue = e.message;
      res.setStatus = e.status;
      return res;
    }
  }
}

export { DoctorController };
