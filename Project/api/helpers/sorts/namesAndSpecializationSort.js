/**
 * get an sort condition
 * @param {object} sorts
 * @returns {string} sort condition
 */
import { lastNameSort, firstNameSort, specializationSort } from './index';

export function namesAndSpecializationSort(sorts) {
  let condition = '';
  if (sorts.firstNameSort) {
    condition = `ORDER BY ${firstNameSort(sorts.firstNameSort)}`;
  }
  if (sorts.lastNameSort) {
    condition = `ORDER BY ${lastNameSort(sorts.lastNameSort)}`;
  }
  if (sorts.specializationSort) {
    condition = `ORDER BY ${specializationSort(sorts.specializationSort)}`;
  }
  return condition;
}
