/**
 * check doctor ID condition
 * @param {string} doctorID
 * @returns {string} check condition
 */
export function checkDoctorIDCondition(doctorID) {
  let doctorCondition = '';
  if (doctorID) {
    doctorCondition = ' AND doctor_id = ?';
  }
  return doctorCondition;
}
