import fs from 'fs';

class AppointmentsService {
  constructor(appointmentsRepository) {
    this.appointmentsRepository = appointmentsRepository;
  }

  /**
     * Register new user
     * @param {object} appointmentData
     * @param {string} patientID
     * @returns {Promise<object>} created appointment
     */
  async createAppointment(patientID, appointmentData) {
    const data = {
      patient_id: patientID,
      doctor_id: appointmentData.doctorID,
      visit_date: appointmentData.date,
      reason: appointmentData.reason,
      note: appointmentData.note,
      status_id: '6e4350d4-280e-11ec-9621-0242ac130002',
    };
    const createdAppointment = await this.appointmentsRepository.createAppointment(data);
    return createdAppointment;
  }

  /**
     * delete an appointment
     * @param {string} appointmentID
     * @returns {Promise<object>} delete appointment
     */
  async deleteAppointment(appointmentID) {
    const deletedAppointmentID = await this.appointmentsRepository.deleteAppointment(appointmentID);
    return deletedAppointmentID;
  }

  /**
     * update an appointment
     * @param {string} appointmentID
     * @param {string} statusID
     * @param {string} doctorID
     * @returns {Promise<object>} update appointment ID
     */
  async updateAppointment(appointmentID, statusID, doctorID) {
    const updatedAppointmentID = await this.appointmentsRepository.updateAppointment(
      appointmentID,
      statusID,
      doctorID,
    );
    return updatedAppointmentID;
  }

  /**
     * get an appointments
     * @param {string} doctorID
     * @param {string} name
     * @returns {Promise<array>} appointments
     */
  async getAppointmentsForDoctor(doctorID, name) {
    const appointments = await this.appointmentsRepository.getAppointmentsForDoctor(
      doctorID,
      name,
    );
    appointments.photo = fs.readFileSync(`.${appointments.photo}`);
    return appointments;
  }

  /**
     * get an appointments
     * @param {string} patientID
     * @param {string} name
     * @returns {Promise<array>} update appointment ID
     */
  async getAppointmentsForPatient(patientID, name) {
    const appointments = await this.appointmentsRepository.getAppointmentsForPatient(
      patientID,
      name,
    );
    appointments.photo = fs.readFileSync(`.${appointments.photo}`);
    return appointments;
  }
}

export { AppointmentsService };
