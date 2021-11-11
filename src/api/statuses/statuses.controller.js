import { StatusCodes } from 'http-status-codes';
import RequestResult from '../helpers/RequestResult';
import APIMessage from "../helpers/APIMessage";

class StatusesController {
  /**
     * Get all available statuses
     * @returns {Promise<object>} statuses array
     */
  async getAllStatuses() {
    const res = new RequestResult();
    try {
      res.setValue = ['waiting', 'canceled', 'confirmed'];
      res.setStatus = StatusCodes.OK;
      return res;
    } catch (e) {
      res.setValue = new APIMessage(e.message).message;
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
