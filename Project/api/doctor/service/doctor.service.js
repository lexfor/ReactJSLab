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
    const doctorSpecialization = {
      doctor_id: user.id,
      specialization_id: doctor.occupationID,
    };
    await this.doctorSpecializationRepository.addDoctorSpecialization(doctorSpecialization);
  }

  /**
   * delete doctor
   * @param {string} doctorID
   */
  async deleteDoctor(doctorID) {
    await this.doctorSpecializationRepository.deleteDoctorSpecialization(doctorID);
  }

  /**
   * get doctor
   * @param {string} doctorID
   * @param {string} specializationID
   * @returns {string} specializations
   */
  async getDoctorSpecializations(doctorID, specializationID) {
    const specializations = await this.doctorSpecializationRepository.getDoctorSpecializations(
      doctorID,
      specializationID,
    );
    return specializations.specialization_name;
  }

  /**
   * update doctor
   * @param {string} doctorID
   * @param {object} doctor
   */
  async updateDoctor(doctorID, doctor) {
    await this.doctorSpecializationRepository.deleteDoctorSpecialization(doctorID);
    doctor.occupationID.forEach((specializationID) => {
      this.doctorSpecializationRepository.addDoctorSpecialization({
        doctor_id: doctorID,
        specialization_id: specializationID,
      });
    });
  }
}
export { DoctorService };
