/**
 * get an sort condition
 * @param {string} type
 * @returns {string} sort condition
 */
import { SORT_TYPE } from '../../../constants';

export function nextDateSort(type) {
  let dateSortCondition = '';
  switch (type) {
    case SORT_TYPE.ASC:
      dateSortCondition = 'next_appointment_date ASC';
      break;
    case SORT_TYPE.DESC:
      dateSortCondition = 'next_appointment_date DESC';
      break;
    default:
      break;
  }
  return dateSortCondition;
}
