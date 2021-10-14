/**
 * get an sort condition
 * @param {object} sorts
 * @returns {string} sort condition
 */
import { dateSort, lastNameSort } from './index';

export function dateAndNameSort(sorts) {
  let condition = '';
  if (sorts.dateSort) {
    condition += `ORDER BY ${dateSort(sorts.dateSort)}`;
  }
  if (sorts.nameSort) {
    condition += `ORDER BY ${lastNameSort(sorts.nameSort)}`;
  }
  return condition;
}
