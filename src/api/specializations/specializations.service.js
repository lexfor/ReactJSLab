import { StatusCodes } from 'http-status-codes';
import ApiError from '../helpers/ApiError';

class SpecializationsService {
  constructor(specializationsRepository) {
    this.specializationsRepository = specializationsRepository;
  }

  /**
     * Get all available doctors specializations
     * @returns {Promise<array>} specializations array
     */
  async getAllSpecializations() {
    const specializations = await this.specializationsRepository.getAllSpecializations();
    if (specializations.length === 0) {
      throw new ApiError('no specializations', StatusCodes.NOT_FOUND);
    }
    return specializations;
  }
}

export { SpecializationsService };
