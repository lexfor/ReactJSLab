import { StatusCodes } from 'http-status-codes';
import RequestResult from '../helpers/RequestResult';
import { APPOINTMENTS_STATUSES } from '../../constants';

class StatusesController {
  /**
     * Get all available statuses
     * @returns {Promise<object>} statuses array
     */
  async getAllStatuses() {
    const res = new RequestResult();
    try {
      res.setValue = APPOINTMENTS_STATUSES;
      res.setStatus = StatusCodes.OK;
      return res;
    } catch (e) {
      res.setValue = e.message;
      res.setStatus = e.status;
      return res;
    }
  }
}

export { StatusesController };
