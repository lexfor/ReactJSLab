import {StatusCodes} from "http-status-codes";
import ApiError from "../helpers/ApiError";
import {SPECIALIZATIONS_ENUM} from "../../constants";

class DoctorService {
  constructor(doctorSpecializationRepository) {
    this.doctorSpecializationRepository = doctorSpecializationRepository;
  }

  /**
   * create new doctor
   * @param {object} doctor
   * @param {object} user
   */
  async createDoctor(doctor, user) {
    for (const occupation of doctor.specializations) {
      await this.doctorSpecializationRepository.addDoctorSpecialization({
        doctor_id: user.id,
        specialization_id: SPECIALIZATIONS_ENUM[occupation],
      });
    }
  }

  /**
   * delete doctor
   * @param {string} doctorID
   */
  async deleteDoctor(doctorID) {
    await this.doctorSpecializationRepository.deleteDoctorSpecialization(doctorID);
  }

  /**
   * update doctor
   * @param {string} doctorID
   * @param {object} doctor
   */
  async updateDoctor(doctorID, doctor) {
    await this.doctorSpecializationRepository.deleteDoctorSpecialization(doctorID);
    for (const occupation of doctor.specializations) {
      await this.doctorSpecializationRepository.addDoctorSpecialization({
        doctor_id: doctorID,
        specialization_id: SPECIALIZATIONS_ENUM[occupation],
      });
    }
  }

  /**
   * check doctor specialization
   * @param {string[]} specializations
   */
  async checkSpecializations(specializations) {
    const specializationNames = ['surgeon', 'therapist', 'ophthalmologist', 'pediatrician'];
    for (const specialization of specializations) {
        if (specializationNames.indexOf(specialization) === -1) {
          throw new ApiError('wrong specializations name', StatusCodes.BAD_REQUEST);
        }
    }
  }
}
export { DoctorService };
