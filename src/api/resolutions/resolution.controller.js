import { StatusCodes } from 'http-status-codes';
import RequestResult from '../helpers/RequestResult';
import {
  NEXT_VISIT_DAYS_DELAY, SECOND_VISIT, SORT_TYPE, SORTS,
} from '../../constants';

class ResolutionController {
  constructor(resolutionService, appointmentService, usersService) {
    this.resolutionService = resolutionService;
    this.appointmentService = appointmentService;
    this.usersService = usersService;
  }

  /**
   * Create new resolution
   * @param {object} resolution
   * @param {string} userID
   * @returns {Promise<object>} resolution data and status
   */
  async createResolution(userID, resolution) {
    const res = new RequestResult();
    try {
      await this.usersService.checkIsDoctor(userID);
      await this.resolutionService.checkIsResolutionExist(resolution.appointmentID);
      await this.appointmentService.checkIsAppointmentExist(resolution.appointmentID);
      const appointment = await this.appointmentService.getAppointmentByID(
        resolution.appointmentID,
      );
      appointment.visit_date.setDate(appointment.visit_date.getDate() + NEXT_VISIT_DAYS_DELAY);
      const nextAppointment = await this.appointmentService.createAppointment(
        appointment.patient_id,
        {
          doctorID: appointment.doctor_id,
          reason: appointment.reason,
          note: SECOND_VISIT,
          date: appointment.visit_date,
        },
      );
      const data = {
        appointment_id: resolution.appointmentID,
        next_appointment_date: nextAppointment.visit_date,
        resolution: resolution.resolution,
      };
      const createdResolution = await this.resolutionService.createResolution(data, userID);
      res.setValue = createdResolution;
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
   * Update resolution
   * @param {object} resolution
   * @param {string} resolutionID
   * @param {string} userID
   * @returns {Promise<object>} resolution data and status
   */
  async updateResolution(resolutionID, resolution, userID) {
    const res = new RequestResult();
    try {
      await this.usersService.checkIsDoctor(userID);
      await this.resolutionService.checkIsResolutionExistByID(resolutionID);
      await this.usersService.checkIsDoctorExist(userID);
      await this.resolutionService.checkIsItYourResolution(resolutionID, userID);
      res.setValue = await this.resolutionService.updateResolution(
        resolutionID,
        resolution.resolution,
        userID,
      );
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
   * Delete resolution
   * @param {string} resolutionID
   * @param {string} userID
   * @returns {Promise<object>} resolution id and status
   */
  async deleteResolution(resolutionID, userID) {
    const res = new RequestResult();
    try {
      await this.usersService.checkIsDoctor(userID);
      await this.resolutionService.checkIsResolutionExistByID(resolutionID);
      await this.usersService.checkIsDoctorExist(userID);
      await this.resolutionService.checkIsItYourResolution(resolutionID, userID);
      res.setValue = await this.resolutionService.deleteResolution(resolutionID, userID);
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
   * Get resolutions
   * @param {object} data
   * @returns {Promise<object>} resolution id and status
   */
  async getPatientResolutionsByDoctorSpecializationID(data) {
    const res = new RequestResult();
    try {
      const searchData = {
        ...data,
        sort: SORTS[data.sort],
        variant: SORT_TYPE[data.variant],
      };
      await this.usersService.checkIsPatient(data.patientID);
      res.setValue = await this.resolutionService.getPatientResolutionsByDoctorSpecializationID(
        searchData,
      );
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
   * Get resolutions
   * @param {object} data
   * @returns {Promise<object>} resolution id and status
   */
  async getPatientResolutionsByDate(data) {
    const res = new RequestResult();
    try {
      const searchData = {
        ...data,
        sort: SORTS[data.sort],
        variant: SORT_TYPE[data.variant],
      };
      await this.usersService.checkIsPatient(data.patientID);
      res.setValue = await this.resolutionService.getPatientResolutionsByDate(searchData);
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
   * Get resolutions
   * @param {object} data
   * @returns {Promise<object>} resolution array and status
   */
  async getResolutionsForPatient(data) {
    const res = new RequestResult();
    try {
      const searchData = {
        ...data,
        sort: SORTS[data.sort],
        variant: SORT_TYPE[data.variant],
      };
      await this.usersService.checkIsPatient(data.patientID);
      res.setValue = await this.resolutionService.getResolutionsForPatient(searchData);
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
   * Get my resolutions
   * @param {object} data
   * @returns {Promise<object>} resolution array and status
   */
  async getResolutionsForDoctor(data) {
    const res = new RequestResult();
    try {
      const searchData = {
        ...data,
        sort: SORTS[data.sort],
        variant: SORT_TYPE[data.variant],
      };
      await this.usersService.checkIsDoctor(data.doctorID);
      res.setValue = await this.resolutionService.getResolutionsForDoctor(searchData);
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

export { ResolutionController };
