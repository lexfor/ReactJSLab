import RequestResult from '../../helpers/RequestResult';
import {ROLES, STATUSES} from '../../../constants';

class AuthenticationController {
  constructor(authenticationService, patientService, jwtService, doctorService, adminsService) {
    this.authenticationService = authenticationService;
    this.patientService = patientService;
    this.jwtService = jwtService;
    this.doctorService = doctorService;
    this.adminsService = adminsService;
  }

  /**
   * Create new user
   * @param {object} user
   * @returns {Promise<object>} created jwt token and status
   */
  async register(user) {
    const res = new RequestResult();
    try {
      const createdUser = await this.authenticationService.register(user, ROLES.PATIENT);
      await this.patientService.createPatient(user, createdUser);
      const result = this.jwtService.createSign(createdUser.id);
      result.user = await this.patientService.getPatientByUser(createdUser.id);
      result.role = ROLES.PATIENT;
      res.setValue = result;
      res.setStatus = STATUSES.CREATED;
      return res;
    } catch (e) {
      res.setValue = e.message;
      res.setStatus = e.status;
      return res;
    }
  }

  /**
   * Check user login
   * @param {object} user
   * @returns {Promise<object>} created jwt token and status
   */
  async login(user) {
    const res = new RequestResult();
    try {
      const foundedUser = await this.authenticationService.login(user);
      const result = this.jwtService.createSign(foundedUser.id);

      switch (foundedUser.role) {
        case "Patient":
          result.user = await this.patientService.getPatientByUser(foundedUser.id);
          break;
        case "Doctor":
          result.user = await this.doctorService.getDoctorByUserID(foundedUser.id);
          break;
        case "Admin":
          result.user = await this.adminsService.getAdminByUserID(foundedUser.id);
          break;
      }

      result.role = foundedUser.role;
      res.setValue = result;
      res.setStatus = STATUSES.OK;
      return res;
    } catch (e) {
      res.setValue = e.message;
      res.setStatus = e.status;
      return res;
    }
  }

  /**
   * Check jwt token
   * @param {string} token
   * @returns {Promise<object>} userID from jwt token and status
   */
  async checkToken(token) {
    const res = new RequestResult();
    try {
      res.setValue = this.jwtService.verifySign(token);
      res.setStatus = STATUSES.OK;
      return res;
    } catch (e) {
      res.setValue = e.message;
      res.setStatus = e.status;
      return res;
    }
  }

  /**
   * refresh jwt token
   * @param {string} token
   * @returns {Promise<object>} refreshed jwt token and status
   */
  async refreshToken(token) {
    const res = new RequestResult();
    try {
      res.setValue = this.jwtService.refreshToken(token);
      res.setStatus = STATUSES.OK;
      return res;
    } catch (e) {
      res.setValue = e.message;
      res.setStatus = e.status;
      return res;
    }
  }

  /**
   * change user password
   * @param {string} userID
   * @param {object} password
   * @returns {Promise<object>} status
   */
  async changePassword(userID, { oldPassword, newPassword }) {
    const res = new RequestResult();
    try {
      res.setValue = await this.authenticationService.changePassword(userID, oldPassword, newPassword);
      res.setStatus = STATUSES.OK;
      return res;
    } catch (e) {
      res.setValue = e.message;
      res.setStatus = e.status;
      return res;
    }
  }
}

export { AuthenticationController };
