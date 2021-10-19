import { StatusCodes } from 'http-status-codes';
import RequestResult from '../helpers/RequestResult';

class SpecializationsController {
  constructor(specializationsService) {
    this.specializationsService = specializationsService;
  }

  /**
     * Get all available doctors specializations
     * @returns {Promise<object>} specializations array
     */
  async getAllSpecializations() {
    const res = new RequestResult();
    try {
      res.setValue = await this.specializationsService.getAllSpecializations();
      res.setStatus = StatusCodes.OK;
      return res;
    } catch (e) {
      res.setValue = e.message;
      res.setStatus = e.status;
      return res;
    }
  }
}

export { SpecializationsController };
