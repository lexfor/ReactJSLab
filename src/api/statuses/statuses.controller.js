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
      if (e.status) {
        res.setStatus = e.status;
      } else {
        res.setStatus = StatusCodes.INTERNAL_SERVER_ERROR;
      }
      return res;
    }
  }
}

export { StatusesController };
