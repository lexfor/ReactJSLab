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
    if (!specializations) {
      throw new ApiError('no specializations', StatusCodes.NOT_FOUND);
    }
    return specializations;
  }

/*  /!**
   * add specializations names
   * @returns {Promise<array>} data array
   *!/
  async getSpecialization(data) {
    for (const item of data) {
      console.log(item);
      const specializations = item.specialization_id.split(', ');
      item.specialization_name = '';
      for (const specialization of specializations) {
        console.log(specialization);
        const specialization_name = await this.specializationsRepository.getSpecializationByID(specialization);
        console.log(specialization_name);
        item.specialization_name += specialization_name;
      }
    }
    return data;
  } */
}

export { SpecializationsService };
