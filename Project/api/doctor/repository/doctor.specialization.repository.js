import { promisify } from 'util';
import ApiError from '../../helpers/ApiError';
import { STATUSES } from '../../../constants';

class DoctorSpecializationRepository {
    constructor(connection) {
        this.connection = connection;
    }

    /**
     * add specialization for doctor
     * @param {object} data
     * @returns {Promise<object>} created doctor
     */
    async addDoctorSpecialization(data) {
        try {
            const queryAsync = promisify(this.connection.query).bind(this.connection);
            const sql = 'INSERT INTO doctors_specializations SET ?';
            await queryAsync(sql, data);
            return data;
        } catch (e) {
            throw new ApiError(e.message, STATUSES.SERVER_ERROR);
        }
    }

    /**
     * delete doctors specializations
     * @param {string} doctorID
     * @returns {Promise<object>} delete doctor ID
     */
    async deleteDoctorSpecialization(doctorID) {
        try {
            const queryAsync = promisify(this.connection.query).bind(this.connection);
            const sql = 'DELETE FROM doctors_specializations WHERE doctor_id = ?';
            await queryAsync(sql, doctorID);
            return doctorID;
        } catch (e) {
            throw new ApiError(e.message, STATUSES.SERVER_ERROR);
        }
    }

    /**
     * get all specializations of doctor
     * @param {string} doctorID
     * @returns {Promise<array>} doctor specializations array
     */
    async getDoctorSpecializations(doctorID) {
        try {
            const queryAsync = promisify(this.connection.query).bind(this.connection);
            const sql = 'SELECT * FROM doctors_specializations WHERE doctor_id = ?';
            const result = await queryAsync(sql, doctorID);
            return result;
        } catch (e) {
            throw new ApiError(e.message, STATUSES.SERVER_ERROR);
        }
    }
}

export { DoctorSpecializationRepository };
