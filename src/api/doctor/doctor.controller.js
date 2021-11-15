import { StatusCodes } from 'http-status-codes';
import RequestResult from '../helpers/RequestResult';
import { ROLES_ID, SORT_TYPE, SORTS } from '../../constants';
import APIMessage from "../helpers/APIMessage";

class DoctorController {
  constructor(doctorServices, usersService) {
    this.doctorServices = doctorServices;
    this.usersService = usersService;
  }

  /**
   * create new doctor
   * @param {object} doctor
   * @param {string} userID
   * @returns {Promise<object>} doctor and status
   */
  async createDoctor(doctor, userID) {
    const res = new RequestResult();
    try {
      const userData = {
        ...doctor,
        role_id: ROLES_ID.DOCTOR,
      };
      await this.usersService.checkIsAdmin(userID);
      await this.usersService.checkIsUserExist(userData.userName);
      const createdUser = await this.usersService.createUser(userData);
      const foundedUser = await this.usersService.getUserByID(createdUser.id);
      await this.doctorServices.createDoctor(doctor, createdUser);
      res.setValue = foundedUser;
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
   * delete doctor
   * @param {string} doctorID
   * @param {string} userID
   * @returns {Promise<object>} doctor ID and status
   */
  async deleteDoctor(doctorID, userID) {
    const res = new RequestResult();
    try {
      await this.usersService.checkIsAdmin(userID);
      await this.usersService.checkIsDoctorExist(doctorID);
      await this.usersService.deleteUser(doctorID);
      await this.doctorServices.deleteDoctor(doctorID);
      res.setValue = doctorID;
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
   * update doctor
   * @param {string} doctorID
   * @param {object} doctor
   * @param {string} userID
   * @returns {Promise<object>} doctor and status
   */
  async updateDoctor(doctorID, doctor, userID) {
    const res = new RequestResult();
    try {
      await this.usersService.checkIsAdmin(userID);
      await this.usersService.checkIsDoctorExist(doctorID);
      await this.usersService.updateUser(doctorID, doctor);
      await this.doctorServices.updateDoctor(doctorID, doctor);
      res.setValue = await this.usersService.getDoctorByID(doctorID);
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
   * update doctor
   * @param {string} doctorID
   * @param {object} doctor
   * @returns {Promise<object>} doctor and status
   */
  async updateMyProfile(doctorID, doctor) {
    const res = new RequestResult();
    try {
      await this.usersService.checkIsDoctor(doctorID);
      await this.usersService.checkIsDoctorExist(doctorID);
      await this.usersService.updateUser(doctorID, doctor);
      res.setValue = await this.usersService.getDoctorByID(doctorID);
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
   * @param {string} userID
   * @returns {Promise<object>} doctor and status
   */
  async getMyProfile(userID) {
    const res = new RequestResult();
    try {
      await this.usersService.checkIsDoctor(userID);
      await this.usersService.checkIsDoctorExist(userID);
      res.setValue = await this.usersService.getDoctorByID(userID);
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
   * get all doctors
   * @param {object} data
   * @param {string} userID
   * @returns {Promise<object>} doctors array and status
   */
  async getDoctors(data, userID) {
    const res = new RequestResult();
    try {
      const searchData = {
        ...data,
        sort: SORTS[data.sort],
        variant: SORT_TYPE[data.variant],
      };
      await this.usersService.checkIsAdmin(userID);
      res.setValue = await this.usersService.getDoctors(searchData);
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

export { DoctorController };
