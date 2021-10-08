import { STATUSES } from '../../../constants';
import RequestResult from '../../helpers/RequestResult';

class StatusesController {
    constructor(statusesService) {
        this.statusesService = statusesService;
    }

    /**
     * Get all available statuses
     * @returns {Promise<object>} statuses array
     */
    async getAllStatuses() {
        const res = new RequestResult();
        try {
            res.setValue = await this.statusesService.getAllStatuses();
            res.setStatus = STATUSES.OK;
            return res;
        } catch (e) {
            res.setValue = e.message;
            res.setStatus = e.status;
            return res;
        }
    }
}

export { StatusesController };
