import { v1 as uuidv1 } from 'uuid';
import { APPOINTMENTS_STATUSES, WORK_HOURS } from '../../../constants';

class AppointmentsService {
  constructor(appointmentsRepository) {
    this.appointmentsRepository = appointmentsRepository;
  }

  /**
     * Create new appointments
     * @param {object} appointmentData
     * @param {string} patientID
     * @returns {Promise<object>} created appointment
     */
  async createAppointment(patientID, appointmentData) {
    const data = {
      id: uuidv1(),
      patient_id: patientID,
      doctor_id: appointmentData.doctorID,
      visit_date: appointmentData.date,
      reason: appointmentData.reason,
      note: appointmentData.note,
      status_id: APPOINTMENTS_STATUSES.WAITING,
    };
    const createdAppointment = await this.appointmentsRepository.createAppointment(data);
    return createdAppointment;
  }

  /**
     * delete an appointment
     * @param {string} appointmentID
     * @param {string} userID
     * @returns {Promise<string>} deleted appointment id
     */
  async deleteAppointment(appointmentID, userID) {
    const deletedAppointmentID = await this.appointmentsRepository.deleteAppointment(appointmentID);
    return deletedAppointmentID;
  }

  /**
     * update an appointment
     * @param {string} appointmentID
     * @param {string} statusID
     * @param {string} doctorID
     * @returns {Promise<string>} update appointment ID
     */
  async updateAppointment(appointmentID, statusID, doctorID) {
    const updatedAppointmentID = await this.appointmentsRepository.updateAppointment(
      appointmentID,
      statusID,
    );
    return updatedAppointmentID;
  }

  /**
   * get an appointment by ID
   * @param {string} appointmentID
   * @returns {Promise<object>} appointment
   */
  async getAppointmentByID(appointmentID) {
    const appointment = await this.appointmentsRepository.getAppointmentByID(
      appointmentID,
    );
    return appointment;
  }

  /**
     * get an appointments
     * @param {string} doctorID
     * @param {string} name
     * @param {number} offset
     * @param {number} count
     * @param {object} sorts
     * @returns {Promise<object>} appointments
     */
  async getAppointmentsForDoctor(doctorID, offset, count, name, sorts) {
    const appointments = await this.appointmentsRepository.getAppointmentsForDoctor(
      doctorID,
      offset,
      count,
      name,
      sorts,
    );
    return {
      appointments,
      total: await this.appointmentsRepository.getDoctorQueryCount(doctorID, name),
    };
  }

  /**
   * get an appointments
   * @param {string} patientID
   * @param {string} name
   * @param {number} offset
   * @param {number} count
   * @param {object} sorts
   * @param {object} dateStatus
   * @returns {Promise<object>} appointments
   */
  async getAppointmentsForPatient(patientID, offset, count, name, dateStatus, sorts) {
    const appointments = await this.appointmentsRepository.getAppointmentsForPatient(
      patientID,
      offset,
      count,
      name,
      dateStatus,
      sorts,
    );
    return {
      appointments,
      total: await this.appointmentsRepository.getPatientQueryCount(patientID, name, dateStatus),
    };
  }

  /**
   * get free time for appointments
   * @param {string} date
   * @param {string} doctorID
   * @returns {Promise<number[]>} array of available hours
   */
  async getFreeAppointmentsTime(date, doctorID) {
    const availableHours = [];
    const appointments = await this.appointmentsRepository.getAppointments(date, doctorID);
    const notAvailableHours = appointments.map((appointment) => appointment.visit_date.getHours());
    for (let hour = WORK_HOURS.start; hour <= WORK_HOURS.end; hour += 1) {
      if (notAvailableHours.indexOf(hour) === -1) {
        availableHours.push(hour);
      }
    }
    return availableHours;
  }
}

export { AppointmentsService };
