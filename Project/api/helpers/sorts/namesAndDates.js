/**
 * get an sort condition
 * @param {object} sorts
 * @returns {string} sort condition
 */
import {
  dateSort, lastNameSort, firstNameSort, nextDateSort,
} from './index';

export function namesAndDates(sorts) {
  let condition = '';
  if (sorts.dateSort) {
    condition = `ORDER BY ${dateSort(sorts.dateSort)}`;
  }
  if (sorts.nextDateSort) {
    condition = `ORDER BY ${nextDateSort(sorts.nextDateSort)}`;
  }
  if (sorts.nextDateSort) {
    condition = `ORDER BY ${nextDateSort(sorts.nextDateSort)}`;
  }
  if (sorts.firstNameSort) {
    condition = `ORDER BY ${firstNameSort(sorts.firstNameSort)}`;
  }
  if (sorts.lastNameSort) {
    condition = `ORDER BY ${lastNameSort(sorts.lastNameSort)}`;
  }
  return condition;
}
