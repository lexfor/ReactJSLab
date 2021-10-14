import { v1 as uuidv1 } from 'uuid';

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
    const resolutionData = {
      ...data,
      id: uuidv1(),
    };
    const resolution = await this.resolutionRepository.createResolution(resolutionData);
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
   * @param {number} offset
   * @param {number} count
   * @param {object} sorts
   * @returns {Promise<object>} resolution ID
   */
  async getResolutions(patientID, offset, count, name, sorts) {
    const result = await this.resolutionRepository.getResolutions(
      patientID,
      offset,
      count, name,
      sorts,
    );
    return {
      resolutions: result,
      total: await this.resolutionRepository.getPatientQueryCount(patientID, name),
    };
  }

  /**
   * Get my resolutions
   * @param {string} doctorID
   * @param {number} offset
   * @param {number} count
   * @param {string} name
   * @param {object} sorts
   * @returns {Promise<object>} resolution ID
   */
  async getMyResolutions(doctorID, offset, count, name, sorts) {
    const result = await this.resolutionRepository.getMyResolutions(
      doctorID,
      offset,
      count,
      name,
      sorts,
    );
    return {
      resolutions: result,
      total: await this.resolutionRepository.getDoctorQueryCount(doctorID, name),
    };
  }
}

export { ResolutionService };
