/**
 * check date status condition
 * @param {string} dateStatus
 * @returns {string} check condition
 */
import { DATE_STATUS_TYPE } from '../../../constants';
import {ISOdateFixes} from "../ISOdateFixes";

export function checkDateStatus(dateStatus) {
  let dateStatusCondition = '';
  switch (dateStatus) {
    case DATE_STATUS_TYPE.Upcoming:
      dateStatusCondition = ` AND appointments.visit_date > '${ISOdateFixes(new Date().toISOString())}'`;
      break;
    case DATE_STATUS_TYPE.Outdate:
      dateStatusCondition = ` AND appointments.visit_date < '${ISOdateFixes(new Date().toISOString())}}'`;
      break;
    default:
      break;
  }
  return dateStatusCondition;
}
