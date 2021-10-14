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
