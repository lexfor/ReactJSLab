/**
 * check date status condition
 * @param {string} dateStatus
 * @returns {string} check condition
 */
import { DATE_STATUS_TYPE } from '../../../constants';

export function checkDateStatus(dateStatus) {
  let dateStatusCondition = '';
  switch (dateStatus) {
    case DATE_STATUS_TYPE.UPCOMING:
      dateStatusCondition = ` AND appointments.visit_date > ${new Date().toUTCString()}`;
      break;
    case DATE_STATUS_TYPE.OUTDATE:
      dateStatusCondition = ` AND appointments.visit_date < ${new Date().toUTCString()}`;
      break;
    default:
      break;
  }
  return dateStatusCondition;
}
