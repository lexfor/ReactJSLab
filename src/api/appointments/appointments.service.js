import { v1 as uuidv1 } from 'uuid';
import { StatusCodes } from 'http-status-codes';
import { APPOINTMENTS_STATUSES, WORK_HOURS } from '../../constants';
import ApiError from '../helpers/ApiError';
import {ISOdateFixes} from "../helpers/ISOdateFixes";

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
      status: 'waiting',
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
     * @param {string} date
     * @returns {Promise<string>} update appointment ID
     */
  async updateAppointment(appointmentID, statusID, date) {
    const updatedAppointmentID = await this.appointmentsRepository.updateAppointment(
      appointmentID,
      statusID,
      date
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
   * @param {string} doctorID
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
   * @param {string} doctorID
   */
  async checkAppointmentDate(date, doctorID = '') {
    const [appointment] = await this.appointmentsRepository.getAppointments(
      ISOdateFixes(date),
      doctorID,
    );
    if (appointment) {
      throw new ApiError('Date and time not free', StatusCodes.CONFLICT);
    }
  }

  /**
     * get an appointments
     * @param {object} data
     * @returns {Promise<object>} appointments
     */
  async getAppointmentsForDoctor(data) {
    const appointments = await this.appointmentsRepository.getAppointmentsForDoctor(data);
    if (appointments.length === 0) {
      return {
        appointments,
        total: 0,
      };
    }
    const [{ total }] = appointments;

    return {
      appointments: appointments.map((item) => {
        delete item.total;
        return item;
      }),
      total: Number(total),
    };
  }

  /**
   * get an appointments
   * @param {object} data
   * @returns {Promise<object>} appointments
   */
  async getAppointmentsForPatient(data) {
    const appointments = await this.appointmentsRepository.getAppointmentsForPatient(data);
    if (appointments.length === 0) {
      return {
        appointments,
        total: 0,
      };
    }
    const [{ total }] = appointments;
    return {
      appointments: appointments.map((item) => {
        delete item.total;
        return item;
      }),
      total: Number(total),
    };
  }

  /**
   * get free time for appointments
   * @param {string} date
   * @param {string} doctorID
   * @returns {Promise<string[]>} array of available hours
   */
  async getFreeAppointmentsTime(date, doctorID) {

    const filteredDate = ISOdateFixes(date);
    const checkedDate = filteredDate.split(' ')[0];
    const availableHours = [];
    const appointments = await this.appointmentsRepository.getAppointments(checkedDate, doctorID);
    const notAvailableHours = appointments.map((appointment) => appointment.visit_date.getHours());
    for (let hour = WORK_HOURS.start; hour <= WORK_HOURS.end; hour += WORK_HOURS.step) {
      if (notAvailableHours.indexOf(hour) === -1) {
        availableHours.push(new Date(`${checkedDate} ${hour}:`).toISOString());
      }
    }
    return availableHours;
  }
}

export { AppointmentsService };
