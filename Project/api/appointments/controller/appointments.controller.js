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
     * @param {string} doctorID
     * @returns {Promise<object>} delete appointment ID and status
     */
  async deleteAppointment(appointmentID, doctorID) {
    const res = new RequestResult();
    try {
      res.setValue = await this.appointmentService.deleteAppointment(appointmentID, doctorID);
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
     * @param {number} offset
     * @param {number} count
     * @param {string} dateSort
     * @param {string} nameSort
     * @returns {Promise<object>} appointments and status
     */
  async getAppointmentsForDoctor(doctorID, offset, count, name, dateSort, nameSort) {
    const res = new RequestResult();
    try {
      const sorts = { dateSort, nameSort };
      res.setValue = await this.appointmentService.getAppointmentsForDoctor(
        doctorID,
        offset,
        count,
        name,
        sorts,
      );
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
     * @param {number} offset
     * @param {number} count
     * @param {string} dateSort
     * @param {string} nameSort
     * @param {string} dateStatus
     * @returns {Promise<object>} appointments and status
     */
  async getAppointmentsForPatient(patientID, offset, count, name, dateStatus, dateSort, nameSort) {
    const res = new RequestResult();
    try {
      const sorts = { dateSort, nameSort };
      res.setValue = await this.appointmentService.getAppointmentsForPatient(
        patientID,
        offset,
        count,
        name,
        dateStatus,
        sorts,
      );
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
