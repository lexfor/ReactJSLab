import { StatusCodes } from 'http-status-codes';
import RequestResult from '../../helpers/RequestResult';

class AppointmentsController {
  constructor(appointmentService) {
    this.appointmentService = appointmentService;
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
     * @returns {Promise<object>} delete appointment ID and status
     */
  async deleteAppointment(appointmentID) {
    const res = new RequestResult();
    try {
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
     * @returns {Promise<object>} update appointment ID and status
     */
  async updateAppointment(appointmentID, appointmentData, doctorID) {
    const res = new RequestResult();
    try {
      res.setValue = await this.appointmentService.updateAppointment(
        appointmentID,
        appointmentData.statusID,
        doctorID,
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
     * @param {string} doctorID
     * @param {string} name
     * @returns {Promise<object>} update appointment ID and status
     */
  async getAppointmentsForDoctor(doctorID, name) {
    const res = new RequestResult();
    try {
      res.setValue = await this.appointmentService.getAppointmentsForDoctor(doctorID, name);
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
     * @param {string} patientID
     * @param {string} name
     * @returns {Promise<object>} update appointment ID and status
     */
  async getAppointmentsForPatient(patientID, name) {
    const res = new RequestResult();
    try {
      res.setValue = await this.appointmentService.getAppointmentsForPatient(patientID, name);
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
