import { StatusCodes } from 'http-status-codes';
import RequestResult from '../../helpers/RequestResult';

class ResolutionController {
  constructor(resolutionService) {
    this.resolutionService = resolutionService;
  }

  /**
   * Create new resolution
   * @param {object} resolution
   * @param {string} userID
   * @returns {Promise<object>} resolution data and status
   */
  async createResolution(userID, resolution) {
    const res = new RequestResult();
    try {
      const data = {
        doctor_id: userID,
        patient_id: resolution.patientID,
        value: resolution.resolution,
      };
      res.setValue = await this.resolutionService.createResolution(data);
      res.setStatus = StatusCodes.CREATED;
      return res;
    } catch (e) {
      res.setValue = e.message;
      res.setStatus = e.status;
      return res;
    }
  }

  /**
   * Update resolution
   * @param {object} resolution
   * @param {string} resolutionID
   * @param {string} userID
   * @returns {Promise<object>} resolution data and status
   */
  async updateResolution(resolutionID, resolution, userID) {
    const res = new RequestResult();
    try {
      res.setValue = await this.resolutionService.updateResolution(
        resolutionID,
        resolution.resolution,
        userID,
      );
      res.setStatus = StatusCodes.ACCEPTED;
      return res;
    } catch (e) {
      res.setValue = e.message;
      res.setStatus = e.status;
      return res;
    }
  }

  /**
   * Delete resolution
   * @param {string} resolutionID
   * @param {string} userID
   * @returns {Promise<object>} resolution data and status
   */
  async deleteResolution(resolutionID, userID) {
    const res = new RequestResult();
    try {
      res.setValue = await this.resolutionService.deleteResolution(resolutionID, userID);
      res.setStatus = StatusCodes.ACCEPTED;
      return res;
    } catch (e) {
      res.setValue = e.message;
      res.setStatus = e.status;
      return res;
    }
  }

  /**
   * Get resolutions
   * @param {string} userID
   * @param {string} name
   * @returns {Promise<object>} resolution data and status
   */
  async getResolutions(userID, name) {
    const res = new RequestResult();
    try {
      res.setValue = await this.resolutionService.getResolutions(userID, name);
      res.setStatus = StatusCodes.OK;
      return res;
    } catch (e) {
      res.setValue = e.message;
      res.setStatus = e.status;
      return res;
    }
  }

  /**
   * Get my resolutions
   * @param {string} userID
   * @param {string} name
   * @returns {Promise<object>} resolution data and status
   */
  async getMyResolutions(userID, name) {
    const res = new RequestResult();
    try {
      res.setValue = await this.resolutionService.getMyResolutions(userID, name);
      res.setStatus = StatusCodes.OK;
      return res;
    } catch (e) {
      res.setValue = e.message;
      res.setStatus = e.status;
      return res;
    }
  }
}

export { ResolutionController };
