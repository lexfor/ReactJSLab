import { StatusCodes } from 'http-status-codes';
import ApiError from './ApiError';

/**
 * change time format to local
 * @returns {Promise<array>} total number
 */
export function changeTimeToLocal(data) {
  try {
    return data.map((item) => {
      if (item.visit_date) {
        item.visit_date = item.visit_date.toLocaleString('ru', { hour12: false });
      }
      if (item.next_appointment_date) {
        item.next_appointment_date = item.next_appointment_date.toLocaleString('ru', { hour12: false });
      }
      return item;
    });
  } catch (e) {
    throw new ApiError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}
