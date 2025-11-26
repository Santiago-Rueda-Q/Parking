export class MapRepository {
  /** @returns {Promise<{rows:number, cols:number, vip:string[], disability:string[]}>} */
  async loadConfig() { throw new Error('Not implemented') }
  /** @param {{rows:number, cols:number, vip:string[], disability:string[]}} cfg */
  async saveConfig(_cfg) { throw new Error('Not implemented') }
}