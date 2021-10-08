import RequestResult from '../../helpers/RequestResult';
import { STATUSES } from '../../../constants';

class AppointmentsController {
    constructor(appointmentService, patientService, doctorService) {
        this.appointmentService = appointmentService;
        this.patientService = patientService;
        this.doctorService = doctorService;
    }

    /**
     * Create new appointment
     * @param {string} userID
     * @param {object} appointmentData
     * @returns {Promise<object>} created appointment and status
     */
    async createAppointment(userID, appointmentData) {
        const res = new RequestResult();
        try {
            const patient = await this.patientService.getPatientByUser(userID);
            res.setValue = await this.appointmentService.createAppointment(patient.id, appointmentData);
            res.setStatus = STATUSES.CREATED;
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
            res.setStatus = STATUSES.ACCEPTED;
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
     * @param {string} userID
     * @returns {Promise<object>} update appointment ID and status
     */
    async updateAppointment(appointmentID, appointmentData, userID) {
        const res = new RequestResult();
        try {
            const doctor = await this.doctorService.getDoctorByUserID(userID);
            res.setValue = await this.appointmentService.updateAppointment(
                appointmentID,
                appointmentData.statusID,
                doctor.id,
            );
            res.setStatus = STATUSES.ACCEPTED;
            return res;
        } catch (e) {
            res.setValue = e.message;
            res.setStatus = e.status;
            return res;
        }
    }

    /**
     * get appointments
     * @param {string} userID
     * @param {string} patientInfo
     * @returns {Promise<object>} update appointment ID and status
     */
    async getAppointments(userID, patientInfo) {
        const res = new RequestResult();
        try {
            const doctor = await this.doctorService.getDoctorByUserID(userID);
            res.setValue = await this.appointmentService.getAppointmentsByDoctorID(doctor.id, patientInfo);
            res.setStatus = STATUSES.OK;
            return res;
        } catch (e) {
            res.setValue = e.message;
            res.setStatus = e.status;
            return res;
        }
    }

    /**
     * get my appointments
     * @param {string} userID
     * @returns {Promise<object>} update appointment ID and status
     */
    async getMyAppointments(userID) {
        const res = new RequestResult();
        try {
            const patient = await this.patientService.getPatientByUser(userID);
            res.setValue = await this.appointmentService.getMyAppointments(patient.id);
            res.setStatus = STATUSES.OK;
            return res;
        } catch (e) {
            res.setValue = e.message;
            res.setStatus = e.status;
            return res;
        }
    }
}

export { AppointmentsController };
