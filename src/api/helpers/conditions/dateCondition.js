/**
 * get an date condition
 * @param {string} date
 * @returns {string} date condition
 */
import {ISOdateFixes} from "../ISOdateFixes";

export function dateCondition(date) {
  let dateConditionFilter = '';
  if (date) {
    dateConditionFilter = `AND (appointments.visit_date::text LIKE '%${ISOdateFixes(date)}%' 
        OR resolutions.next_appointment_date::text LIKE '%${ISOdateFixes(date)}%')`;
  }
  return dateConditionFilter;
}
