export class EntriesRepository {
    /** @returns {Promise<Array>} */
    async listActive() { throw new Error('Not implemented') }
    /** @param {any} entry */
    async add(entry) { throw new Error('Not implemented') }
    /** @param {string} plate */
    async removeByPlate(plate) { throw new Error('Not implemented') }
}