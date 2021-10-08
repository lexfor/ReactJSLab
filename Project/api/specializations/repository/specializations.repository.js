import {promisify} from 'util';
import ApiError from '../../helpers/ApiError';
import {STATUSES} from '../../../constants';

class SpecializationsRepository {
    constructor(connection) {
        this.connection = connection;
    }

    /**
     * Get all available doctors specializations
     * @returns {Promise<array>} specializations array
     */
    async getAllSpecializations() {
        try {
            const queryAsync = promisify(this.connection.query).bind(this.connection);
            const sql = 'SELECT * FROM specializations ';
            return await queryAsync(sql);
        } catch (e) {
            throw new ApiError(e.message, STATUSES.SERVER_ERROR);
        }
    }
}

export { SpecializationsRepository };
