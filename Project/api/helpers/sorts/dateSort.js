/**
 * get an sort condition
 * @param {string} type
 * @returns {string} sort condition
 */
import { SORT_TYPE } from '../../../constants';

export function dateSort(type) {
  let dateSortCondition = '';
  switch (type) {
    case SORT_TYPE.ASC:
      dateSortCondition = 'visit_date ASC';
      break;
    case SORT_TYPE.DESC:
      dateSortCondition = 'visit_date DESC';
      break;
    default:
      break;
  }
  return dateSortCondition;
}
