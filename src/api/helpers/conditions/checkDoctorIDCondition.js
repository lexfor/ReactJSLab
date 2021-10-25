/**
 * check doctor ID condition
 * @param {string} doctorID
 * @returns {string} check condition
 */
export function checkDoctorIDCondition(doctorID) {
  let doctorCondition = '';
  if (doctorID) {
    doctorCondition = ` AND appointments.doctor_id = ${doctorID}`;
  }
  return doctorCondition;
}
