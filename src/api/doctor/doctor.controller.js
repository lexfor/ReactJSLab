import { StatusCodes } from 'http-status-codes';
import RequestResult from '../helpers/RequestResult';
import { ROLES_ID, SORT_TYPE, SORTS } from '../../constants';

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
        role_id: ROLES_ID.DOCTOR,
      };
      await this.usersService.checkIsUserExist(userData.login, ROLES_ID.DOCTOR);
      const user = await this.usersService.createUser(userData);
      await this.doctorServices.createDoctor(doctor, user);
      res.setValue = user;
      res.setStatus = StatusCodes.CREATED;
      return res;
    } catch (e) {
      res.setValue = e.message;
      if (e.status) {
        res.setStatus = e.status;
      } else {
        res.setStatus = StatusCodes.INTERNAL_SERVER_ERROR;
      }
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
      await this.usersService.checkIsDoctorExist(userID);
      await this.usersService.deleteUser(userID);
      await this.doctorServices.deleteDoctor(userID);
      res.setValue = userID;
      res.setStatus = StatusCodes.ACCEPTED;
      return res;
    } catch (e) {
      res.setValue = e.message;
      if (e.status) {
        res.setStatus = e.status;
      } else {
        res.setStatus = StatusCodes.INTERNAL_SERVER_ERROR;
      }
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
      await this.usersService.checkIsDoctorExist(userID);
      await this.usersService.updateUser(userID, doctor);
      await this.doctorServices.updateDoctor(userID, doctor);
      res.setValue = await this.usersService.getDoctorByID(userID);
      res.setStatus = StatusCodes.ACCEPTED;
      return res;
    } catch (e) {
      res.setValue = e.message;
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
   * @param {string} userID
   * @returns {Promise<object>} doctor and status
   */
  async getMyProfile(userID) {
    const res = new RequestResult();
    try {
      await this.usersService.checkIsDoctorExist(userID);
      res.setValue = await this.usersService.getDoctorByID(userID);
      res.setStatus = StatusCodes.OK;
      return res;
    } catch (e) {
      res.setValue = e.message;
      if (e.status) {
        res.setStatus = e.status;
      } else {
        res.setStatus = StatusCodes.INTERNAL_SERVER_ERROR;
      }
      return res;
    }
  }

  /**
   * get all doctors
   * @param {object} data
   * @returns {Promise<object>} doctors array and status
   */
  async getDoctors(data) {
    const res = new RequestResult();
    try {
      const searchData = {
        ...data,
        sort: SORTS[data.sort],
        variant: SORT_TYPE[data.variant],
      };
      res.setValue = await this.usersService.getDoctors(searchData);
      res.setStatus = StatusCodes.OK;
      return res;
    } catch (e) {
      res.setValue = e.message;
      if (e.status) {
        res.setStatus = e.status;
      } else {
        res.setStatus = StatusCodes.INTERNAL_SERVER_ERROR;
      }
      return res;
    }
  }

  /**
   * get all doctors
   * @param {string} specializationID
   * @param {string} name
   * @returns {Promise<object>} doctors array and status
   */
  async getDoctorsBySpecializations(specializationID, name) {
    const res = new RequestResult();
    try {
      res.setValue = await this.usersService.getDoctorsBySpecializations(specializationID, name);
      res.setStatus = StatusCodes.OK;
      return res;
    } catch (e) {
      res.setValue = e.message;
      if (e.status) {
        res.setStatus = e.status;
      } else {
        res.setStatus = StatusCodes.INTERNAL_SERVER_ERROR;
      }
      return res;
    }
  }
}

export { DoctorController };
