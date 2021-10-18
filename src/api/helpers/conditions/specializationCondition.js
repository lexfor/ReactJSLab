/**
 * get an name condition
 * @param {string} specializationID
 * @returns {string} name condition
 */
export function specializationCondition(specializationID) {
  let nameCondition = '';
  if (specializationID) {
    nameCondition = ` AND specializations.id LIKE '%${specializationID}%'`;
  }
  return nameCondition;
}
