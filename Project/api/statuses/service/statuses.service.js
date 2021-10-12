import { StatusCodes } from 'http-status-codes';
import ApiError from '../../helpers/ApiError';

class StatusesService {
  constructor(statusesRepository) {
    this.statusesRepository = statusesRepository;
  }

  /**
     * Get all available statuses
     * @returns {Promise<array>} statuses array
     */
  async getAllStatuses() {
    const specializations = await this.statusesRepository.getAllStatuses();
    if (!specializations) {
      throw new ApiError('no statuses', StatusCodes.NOT_FOUND);
    }
    return specializations;
  }
}

export { StatusesService };
