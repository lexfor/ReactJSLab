import { StatusCodes } from 'http-status-codes';
import RequestResult from '../helpers/RequestResult';

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
      await this.usersService.checkIsPatientExist(patientID);
      await this.usersService.checkIsDoctorExist(appointmentData.doctorID);
      await this.appointmentService.checkAppointmentDate(appointmentData.date);
      res.setValue = await this.appointmentService.createAppointment(patientID, appointmentData);
      res.setStatus = StatusCodes.CREATED;
      return res;
    } catch (e) {
      res.setValue = e.message;
      res.setStatus = e.status;
      return res;
    }
  }

  /**
     * delete appointment
     * @param {string} appointmentID
     * @param {string} doctorID
     * @returns {Promise<object>} delete appointment ID and status
     */
  async deleteAppointment(appointmentID, doctorID) {
    const res = new RequestResult();
    try {
      await this.appointmentService.checkIsAppointmentExist(appointmentID);
      await this.usersService.checkIsDoctorExist(doctorID);
      await this.appointmentService.checkIsItYoursAppointment(appointmentID, doctorID);
      res.setValue = await this.appointmentService.deleteAppointment(appointmentID);
      res.setStatus = StatusCodes.ACCEPTED;
      return res;
    } catch (e) {
      res.setValue = e.message;
      res.setStatus = e.status;
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
      await this.appointmentService.checkIsAppointmentExist(appointmentID);
      await this.appointmentService.checkIsItYoursAppointment(appointmentID, doctorID);
      res.setValue = await this.appointmentService.updateAppointment(
        appointmentID,
        appointmentData.status,
      );
      res.setStatus = StatusCodes.ACCEPTED;
      return res;
    } catch (e) {
      res.setValue = e.message;
      res.setStatus = e.status;
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
      res.setValue = await this.appointmentService.getAppointmentsForDoctor(data);
      res.setStatus = StatusCodes.OK;
      return res;
    } catch (e) {
      res.setValue = e.message;
      res.setStatus = e.status;
      return res;
    }
  }

  /**
     * get my appointments
     * @param {object} data
     * @returns {Promise<object>} appointments and status
     */
  async getAppointmentsForPatient(data) {
    const res = new RequestResult();
    try {
      res.setValue = await this.appointmentService.getAppointmentsForPatient(data);
      res.setStatus = StatusCodes.OK;
      return res;
    } catch (e) {
      res.setValue = e.message;
      res.setStatus = e.status;
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
      res.setStatus = e.status;
      return res;
    }
  }
}

export { AppointmentsController };
