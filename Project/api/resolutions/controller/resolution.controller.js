import { STATUSES } from '../../../constants';
import RequestResult from '../../helpers/RequestResult';

class ResolutionController {
  constructor(resolutionService, patientService, doctorService) {
    this.resolutionService = resolutionService;
    this.patientService = patientService;
    this.doctorService = doctorService;
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
      const doctor = await this.doctorService.getDoctorByUserID(userID);
      const data = {
        doctor_id: doctor.id,
        patient_id: resolution.patientID,
        value: resolution.resolution,
      }
      res.setValue = await this.resolutionService.createResolution(data);
      res.setStatus = STATUSES.CREATED;
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
      const doctor = await this.doctorService.getDoctorByUserID(userID);
      res.setValue = await this.resolutionService.updateResolution(resolutionID, resolution.resolution, doctor.id);
      res.setStatus = STATUSES.ACCEPTED;
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
      const doctor = await this.doctorService.getDoctorByUserID(userID);
      res.setValue = await this.resolutionService.deleteResolution(resolutionID, doctor.id);
      res.setStatus = STATUSES.ACCEPTED;
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
   * @returns {Promise<object>} resolution data and status
   */
  async getResolutions( userID) {
    const res = new RequestResult();
    try {
      const patient = await this.patientService.getPatientByUser(userID);
      res.setValue = await this.resolutionService.getResolutions(patient.id);
      res.setStatus = STATUSES.OK;
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
   * @returns {Promise<object>} resolution data and status
   */
  async getMyResolutions( userID) {
    const res = new RequestResult();
    try {
      const doctor = await this.doctorService.getDoctorByUserID(userID);
      res.setValue = await this.resolutionService.getMyResolutions(doctor.id)
      res.setStatus = STATUSES.OK;
      return res;
    } catch (e) {
      res.setValue = e.message;
      res.setStatus = e.status;
      return res;
    }
  }
}

export { ResolutionController };
