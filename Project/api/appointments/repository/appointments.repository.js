import { promisify } from 'util';
import { v1 as uuidv1 } from 'uuid';
import ApiError from '../../helpers/ApiError';
import { STATUSES } from '../../../constants';

class AppointmentsRepository {
    constructor(connection) {
        this.connection = connection;
    }

    /**
     * Create new appointment
     * @param {object} appointmentData
     * @returns {Promise<object>} appointment info
     */
    async createAppointment(appointmentData) {
        try {
            const uuid = uuidv1();
            const data = { id: uuid, ...appointmentData };
            const queryAsync = promisify(this.connection.query).bind(this.connection);
            const sql = 'INSERT INTO appointments SET ?';
            await queryAsync(sql, data);
            return data;
        } catch (e) {
            throw new ApiError(e.message, STATUSES.SERVER_ERROR);
        }
    }

    /**
     * delete an appointment
     * @param {string} appointmentID
     * @returns {Promise<object>} deleted appointment ID
     */
    async deleteAppointment(appointmentID) {
        try {
            const queryAsync = promisify(this.connection.query).bind(this.connection);
            const sql = 'DELETE FROM appointments WHERE id = ?';
            await queryAsync(sql, appointmentID);
            return appointmentID;
        } catch (e) {
            throw new ApiError(e.message, STATUSES.SERVER_ERROR);
        }
    }

    /**
     * update an appointment
     * @param {string} appointmentID
     * @param {string} statusID
     * @param {string} doctorID
     * @returns {Promise<object>} updated appointment ID
     */
    async updateAppointment(appointmentID, statusID, doctorID) {
        try {
            const queryAsync = promisify(this.connection.query).bind(this.connection);
            const sql = 'UPDATE appointments SET status_id = ? WHERE id = ? AND doctor_id = ?';
            await queryAsync(sql, [statusID, appointmentID, doctorID]);
            return appointmentID;
        } catch (e) {
            throw new ApiError(e.message, STATUSES.SERVER_ERROR);
        }
    }

    /**
     * get an appointments
     * @param {string} doctorID
     * @param {string} patientInfo
     * @returns {Promise<array>} updated appointment ID
     */
    async getAppointmentsByDoctorID(doctorID, patientInfo) {
        try {
            let condition = '';
            if (patientInfo) {
                condition = ` AND patients.last_name LIKE '%${patientInfo}%' OR first_name LIKE '%${patientInfo}%'`;
            }
            const queryAsync = promisify(this.connection.query).bind(this.connection);
            const sql = `SELECT appointments.*, patients.first_name, patients.last_name, statuses.status 
                         FROM appointments 
                         JOIN patients ON patients.id = appointments.patient_id
                         JOIN statuses ON statuses.id = appointments.status_id
                         WHERE appointments.doctor_id = ?` + condition;
            const appointments = await queryAsync(sql, [doctorID]);
            return appointments;
        } catch (e) {
            throw new ApiError(e.message, STATUSES.SERVER_ERROR);
        }
    }

    /**
     * get an my appointments
     * @param {string} patientID
     * @returns {Promise<array>} updated appointment ID
     */
    async getMyAppointments(patientID) {
        try {
            const queryAsync = promisify(this.connection.query).bind(this.connection);
            const sql = `SELECT appointments.*,
                         doctors.first_name,
                         doctors.last_name,
                         statuses.status, 
                         specializations.specialization_name 
                         FROM appointments 
                         JOIN doctors ON doctors.id = appointments.doctor_id
                         JOIN doctors_specializations ON doctors.id = doctors_specializations.doctor_id
                         JOIN specializations 
                         ON specializations.id = doctors_specializations.specialization_id = specializations.id
                         JOIN statuses ON statuses.id = appointments.status_id
                         WHERE appointments.patient_id = ?`;
            const appointments = await queryAsync(sql, [patientID]);
            return appointments;
        } catch (e) {
            throw new ApiError(e.message, STATUSES.SERVER_ERROR);
        }
    }
}

export { AppointmentsRepository };
