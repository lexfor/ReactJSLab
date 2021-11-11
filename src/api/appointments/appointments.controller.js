import { StatusCodes } from 'http-status-codes';
import RequestResult from '../helpers/RequestResult';
import { DATE_STATUS_TYPE, SORT_TYPE, SORTS } from '../../constants';

class AppointmentsController {
  constructor(appointmentService, usersService) {
    this.appointmentService = appointmentService;
    this.usersService = usersService;
  }

  /**
     * Create new appointment
     * @param {string} patientID
     * @param {object} appointmentData
     * @returns {Promise<object>} created appointment and status
     */
  async createAppointment(patientID, appointmentData) {
    const res = new RequestResult();
    try {
      await this.usersService.checkIsPatient(patientID);
      await this.usersService.checkIsPatientExist(patientID);
      await this.usersService.checkIsDoctorExist(appointmentData.doctorID);
      await this.appointmentService.checkAppointmentDate(appointmentData.date);
      res.setValue = await this.appointmentService.createAppointment(patientID, appointmentData);
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
     * delete appointment
     * @param {string} appointmentID
     * @param {string} doctorID
     * @returns {Promise<object>} deleted appointment ID and status
     */
  async deleteAppointment(appointmentID, doctorID) {
    const res = new RequestResult();
    try {
      await this.usersService.checkIsDoctor(doctorID);
      await this.appointmentService.checkIsAppointmentExist(appointmentID);
      await this.usersService.checkIsDoctorExist(doctorID);
      await this.appointmentService.checkIsItYoursAppointment(appointmentID, doctorID);
      res.setValue = await this.appointmentService.deleteAppointment(appointmentID);
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
     * update appointment
     * @param {string} appointmentID
     * @param {object} appointmentData
     * @param {string} doctorID
     * @returns {Promise<object>} update appointment and status
     */
  async updateAppointment(appointmentID, appointmentData, doctorID) {
    const res = new RequestResult();
    try {
      await this.usersService.checkIsDoctor(doctorID);
      await this.appointmentService.checkAppointmentDate(appointmentData.date);
      await this.appointmentService.checkIsAppointmentExist(appointmentID);
      await this.appointmentService.checkIsItYoursAppointment(appointmentID, doctorID);
      res.setValue = await this.appointmentService.updateAppointment(
        appointmentID,
        appointmentData.status,
        appointmentData.date
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
     * get appointments
     * @param {object} data
     * @returns {Promise<object>} appointments and status
     */
  async getAppointmentsForDoctor(data) {
    const res = new RequestResult();
    try {
      const searchData = {
        ...data,
        sort: SORTS[data.sort],
        variant: SORT_TYPE[data.variant],
        dateStatus: DATE_STATUS_TYPE[data.dateStatus],
      };
      await this.usersService.checkIsDoctor(data.doctorID);
      res.setValue = await this.appointmentService.getAppointmentsForDoctor(searchData);
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
     * get my appointments
     * @param {object} data
     * @returns {Promise<object>} appointments and status
     */
  async getAppointmentsForPatient(data) {
    const searchData = {
      ...data,
      sort: SORTS[data.sort],
      variant: SORT_TYPE[data.variant],
      dateStatus: DATE_STATUS_TYPE[data.dateStatus],
    };
    const res = new RequestResult();
    try {
      await this.usersService.checkIsPatient(data.patientID);
      res.setValue = await this.appointmentService.getAppointmentsForPatient(searchData);
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
   * get free time for appointments
   * @param {string} date
   * @param {string} doctorID
   * @returns {Promise<object>} array of times and status
   */
  async getFreeAppointmentsTime(date, doctorID) {
    const res = new RequestResult();
    try {
      res.setValue = await this.appointmentService.getFreeAppointmentsTime(date, doctorID);
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

export { AppointmentsController };
