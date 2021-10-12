import {NEXT_VISIT_MOTHS_DELAY} from "../../../constants";

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
   * @param {string} doctorID
   * @returns {Promise<string>} resolution data
   */
  async updateResolution(resolutionID, resolution, doctorID) {
    const result = await this.resolutionRepository.updateResolution(
      resolutionID,
      resolution,
      doctorID,
    );
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
   * @param {string} name
   * @returns {Promise<array>} resolution ID
   */
  async getResolutions(patientID, name) {
    let result = await this.resolutionRepository.getResolutions(patientID, name);
    result = this.createNextVisitDate(result);
    return result;
  }

  /**
   * Get my resolutions
   * @param {string} doctorID
   * @param {string} name
   * @returns {Promise<array>} resolution ID
   */
  async getMyResolutions(doctorID, name) {
    let result = await this.resolutionRepository.getMyResolutions(doctorID, name);
    result = this.createNextVisitDate(result);
    return result;
  }

  /**
   * Set next visit date
   * @param {array} resolutions
   * @returns {array} result resolutions
   */
  createNextVisitDate(resolutions) {
    return resolutions.map((resolution) => {
      resolution.nextVisit = new Date(resolution.createdTime);
      resolution.nextVisit.setMonth(resolution.nextVisit.getMonth() + NEXT_VISIT_MOTHS_DELAY);
      return resolution;
    });
  }
}

export { ResolutionService };
