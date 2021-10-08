import { STATUSES } from '../../../constants';
import ApiError from '../../helpers/ApiError';

class ResolutionService {
  constructor(resolutionRepository) {
    this.resolutionRepository = resolutionRepository;
  }

  /**
   * Create new resolution for patient
   * @param {object} data
   * @returns {Promise<object>} resolution data
   */
  async createResolution(data) {
    const resolution = await this.resolutionRepository.createResolution(data);
    return resolution;
  }

  /**
   * Update resolution
   * @param {string} resolutionID
   * @param {string} resolution
   * @returns {Promise<string>} resolution data
   */
  async updateResolution(resolutionID, resolution, doctorID) {
    const result = await this.resolutionRepository.updateResolution(resolutionID, resolution, doctorID);
    return result;
  }

  /**
   * Delete resolution
   * @param {string} resolutionID
   * @param {string} doctorID
   * @returns {Promise<object>} resolution ID
   */
  async deleteResolution(resolutionID, doctorID) {
    const result = await this.resolutionRepository.deleteResolution(resolutionID, doctorID);
    return result;
  }

  /**
   * Get resolutions
   * @param {string} patientID
   * @returns {Promise<array>} resolution ID
   */
  async getResolutions(patientID) {
    const result = await this.resolutionRepository.getResolutions(patientID);
    return result;
  }

  /**
   * Get my resolutions
   * @param {string} doctorID
   * @returns {Promise<array>} resolution ID
   */
  async getMyResolutions(doctorID) {
    const result = await this.resolutionRepository.getMyResolutions(doctorID);
    return result;
  }
}

export { ResolutionService };
