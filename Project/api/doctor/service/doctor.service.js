import ApiError from '../../helpers/ApiError';
import { STATUSES } from '../../../constants';

class DoctorService {
  constructor(doctorRepository, doctorSpecializationRepository) {
    this.doctorRepository = doctorRepository;
    this.doctorSpecializationRepository = doctorSpecializationRepository;
  }

  /**
   * create new doctor
   * @param {object} doctor
   * @param {object} user
   * @returns {Promise<object>} created doctor
   */
  async createDoctor(doctor, user) {
    const data = {
      first_name: doctor.firstName,
      last_name: doctor.lastName,
      user_id: user.id,
    }
    const createdDoctor = await this.doctorRepository.createDoctor(data);
    const doctorSpecialization = {
      doctor_id: createdDoctor.id,
      specialization_id: doctor.occupationID,
    };
    await this.doctorSpecializationRepository.addDoctorSpecialization(doctorSpecialization);
    return createdDoctor;
  }

  /**
   * delete doctor
   * @param {string} doctorID
   * @returns {Promise<object>} deleted doctor ID
   */
  async deleteDoctor(doctorID) {

    const deletedDoctor = await this.doctorRepository.getDoctorByID(doctorID);
    await this.doctorRepository.deleteDoctor(doctorID);
    await this.doctorSpecializationRepository.deleteDoctorSpecialization(doctorID);
    return deletedDoctor;
  }

  /**
   * update doctor
   * @param {string} doctorID
   * @param {object} doctor
   * @returns {Promise<object>} updated doctor
   */
  async updateDoctor(doctorID, doctor) {
    const updatedDoctor = await this.doctorRepository.updateDoctor(doctorID, doctor);
    await this.doctorSpecializationRepository.deleteDoctorSpecialization(doctorID);
    doctor.occupationID.forEach((specializationID) => {
      this.doctorSpecializationRepository.addDoctorSpecialization({
        doctor_id: doctorID,
        specialization_id: specializationID,
      });
    });

    return updatedDoctor;
  }

  /**
   * get all doctors
   * @param {string} specializationID
   * @returns {Promise<array>} doctors
   */
  async getDoctors(specializationID) {
    const doctors = await this.doctorRepository.getDoctors(specializationID);
    return doctors;
  }

  /**
   * Get doctor by user ID
   * @param {string} userID
   * @returns {Promise<object>} founded doctor
   */
  async getDoctorByUserID(userID) {
    const result = await this.doctorRepository.getDoctorByUserID(userID);
    if (!result) {
      throw new ApiError('no such doctor', STATUSES.NOT_FOUND);
    }
    return result;
  }

  /**
   * Get doctor by ID
   * @param {string} doctorID
   * @returns {Promise<object>} founded doctor
   */
  async getDoctorByID(doctorID) {
    const result = await this.doctorRepository.getDoctorByID(doctorID);
    if (!result) {
      throw new ApiError('no such doctor', STATUSES.NOT_FOUND);
    }
    return result;
  }
}
export { DoctorService };
