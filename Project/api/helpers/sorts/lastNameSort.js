/**
 * get an sort condition
 * @param {string} type
 * @returns {string} sort condition
 */
import { SORT_TYPE } from '../../../constants';

export function lastNameSort(type) {
  let nameSort = '';
  switch (type) {
    case SORT_TYPE.ASC:
      nameSort = 'last_name ASC';
      break;
    case SORT_TYPE.DESC:
      nameSort = 'last_name DESC';
      break;
    default:
      break;
  }
  return nameSort;
}
