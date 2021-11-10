/**
 * check date status condition
 * @param {string} dateStatus
 * @returns {string} check condition
 */
import { DATE_STATUS_TYPE } from '../../../constants';

export function checkDateStatus(dateStatus) {
  let dateStatusCondition = '';
  switch (dateStatus) {
    case DATE_STATUS_TYPE.Upcoming:
      dateStatusCondition = ` AND appointments.visit_date > '${new Date().toISOString().replace(/[A-Z]/g, ' ')}'`;
      break;
    case DATE_STATUS_TYPE.Outdate:
      dateStatusCondition = ` AND appointments.visit_date < '${new Date().toISOString().replace(/[A-Z]/g, ' ')}'`;
      break;
    default:
      break;
  }
  return dateStatusCondition;
}
