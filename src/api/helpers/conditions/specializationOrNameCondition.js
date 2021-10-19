/**
 * get an name condition
 * @param {string} name
 * @returns {string} name condition
 */
export function specializationOrNameCondition(name) {
  let nameCondition = '';
  if (name) {
    nameCondition = ` AND (users.last_name LIKE '%${name}%' OR 
                users.first_name LIKE '%${name}%') OR
                specialization_name LIKE '%${name}%'`;
  }
  return nameCondition;
}
