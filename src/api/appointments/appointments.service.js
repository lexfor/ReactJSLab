import { v1 as uuidv1 } from 'uuid';
import { StatusCodes } from 'http-status-codes';
import { APPOINTMENTS_STATUSES, WORK_HOURS } from '../../constants';
import ApiError from '../helpers/ApiError';

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
      status: APPOINTMENTS_STATUSES[0],
    };
    const createdAppointment = await this.appointmentsRepository.createAppointment(data);
    return createdAppointment;
  }

  /**
     * delete an appointment
     * @param {string} appointmentID
     * @returns {Promise<string>} deleted appointment id
     */
  async deleteAppointment(appointmentID) {
    const deletedAppointmentID = await this.appointmentsRepository.deleteAppointment(appointmentID);
    return deletedAppointmentID;
  }

  /**
     * update an appointment
     * @param {string} appointmentID
     * @param {string} statusID
     * @returns {Promise<string>} update appointment ID
     */
  async updateAppointment(appointmentID, statusID) {
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
   * check is appointment exist
   * @param {string} appointmentID
   */
  async checkIsAppointmentExist(appointmentID) {
    const appointment = await this.appointmentsRepository.getAppointmentByID(
      appointmentID,
    );
    if (!appointment) {
      throw new ApiError('Appointment not exist', StatusCodes.NOT_FOUND);
    }
  }

  /**
   * check is it yours appointment
   * @param {string} appointmentID
   */
  async checkIsItYoursAppointment(appointmentID, doctorID) {
    const appointment = await this.appointmentsRepository.getAppointmentByID(
      appointmentID,
    );
    if (appointment.doctor_id !== doctorID) {
      throw new ApiError('It is not your appointment', StatusCodes.FORBIDDEN);
    }
  }

  /**
   * check appointment date free
   * @param {string} date
   */
  async checkAppointmentDate(date) {
    const [appointment] = await this.appointmentsRepository.getAppointments(
      date,
      '',
    );
    if (appointment) {
      throw new ApiError('Date and time not free', StatusCodes.BAD_REQUEST);
    }
  }

  /**
     * get an appointments
     * @param {object} data
     * @returns {Promise<object>} appointments
     */
  async getAppointmentsForDoctor(data) {
    const result = await this.appointmentsRepository.getAppointmentsForDoctor(data);
    const { total } = result[0];
    const appointments = result.map((appointment) => {
      delete appointment.total;
      return appointment;
    });
    return {
      appointments,
      total,
    };
  }

  /**
   * get an appointments
   * @param {object} data
   * @returns {Promise<object>} appointments
   */
  async getAppointmentsForPatient(data) {
    const result = await this.appointmentsRepository.getAppointmentsForPatient(data);
    const { total } = result[0];
    const appointments = result.map((appointment) => {
      delete appointment.total;
      return appointment;
    });
    return {
      appointments,
      total,
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
    for (let hour = WORK_HOURS.start; hour <= WORK_HOURS.end; hour += WORK_HOURS.step) {
      if (notAvailableHours.indexOf(hour) === -1) {
        availableHours.push(hour);
      }
    }
    return availableHours;
  }
}

export { AppointmentsService };
