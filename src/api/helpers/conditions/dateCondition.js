/**
 * get an date condition
 * @param {string} date
 * @returns {string} date condition
 */
export function dateCondition(date) {
  let dateConditionFilter = '';
  if (date) {
    dateConditionFilter = `AND (appointments.visit_date::text LIKE '%${date}%' 
        OR resolutions.next_appointment_date::text LIKE '%${date}%')`;
  }
  return dateConditionFilter;
}
