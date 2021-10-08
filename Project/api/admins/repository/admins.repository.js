import { promisify } from 'util';
import ApiError from '../../helpers/ApiError';
import { STATUSES } from '../../../constants';

class AdminsRepository {
    constructor(connection) {
        this.connection = connection;
    }

    /**
     * Get admin by user ID
     * @param {string} userID
     * @returns {Promise<object>} admin data
     */
    async getAdminByUserID(userID) {
        try {
            const queryAsync = promisify(this.connection.query).bind(this.connection);
            const sql = `
                SELECT * 
                FROM admins
                WHERE user_id = ?`;
            const result = await queryAsync(sql, userID);
            return result;
        } catch (e) {
            throw new ApiError(e.message, STATUSES.SERVER_ERROR);
        }
    }
}

export { AdminsRepository };
