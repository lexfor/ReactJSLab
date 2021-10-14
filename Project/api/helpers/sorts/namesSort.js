/**
 * get an sort condition
 * @param {object} sorts
 * @returns {string} sort condition
 */
import { lastNameSort, firstNameSort } from './index';

export function namesSort(sorts) {
  let condition = '';
  if (sorts.firstNameSort) {
    condition = `ORDER BY ${firstNameSort(sorts.firstNameSort)}`;
  }
  if (sorts.lastNameSort) {
    condition = `ORDER BY ${lastNameSort(sorts.lastNameSort)}`;
  }
  return condition;
}
