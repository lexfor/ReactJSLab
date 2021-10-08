class AdminsService {
    constructor(adminsRepository) {
        this.adminsRepository = adminsRepository;
    }

    /**
     * get an admin
     * @param {string} userID
     * @returns {Promise<object>} admin data
     */
    async getAdminByUserID(userID) {
        const appointments = await this.adminsRepository.getAdminByUserID(userID);
        return appointments;
    }
}

export { AdminsService };
