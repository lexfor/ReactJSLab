/**
 * get an name condition
 * @param {string} name
 * @returns {string} name condition
 */
export function nameCondition(name) {
  let nameConditionFilter = '';
  if (name) {
    nameConditionFilter = ` AND (users.last_name LIKE '%${name}%' OR 
                users.first_name LIKE '%${name}%')`;
  }
  return nameConditionFilter;
}
