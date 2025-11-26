export class ClientsRepository {
    /** @returns {Promise<Array<object>>} */
    async listAll() { throw new Error('Not implemented') }
    /** @param {{name:string, phone?:string, email?:string, vip?:boolean}} data */
    async create(data) { throw new Error('Not implemented') }
    /** @param {number} id */
    async delete(id) { throw new Error('Not implemented') }
}
