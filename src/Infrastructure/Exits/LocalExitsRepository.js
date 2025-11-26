import { ExitsRepository } from '@/Domain/Exits/ExitsRepository'
const KEY = 'pc:exits-history'

export class LocalExitsRepository extends ExitsRepository {
  async list() {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  }
  async append(row) {
    const list = await this.list()
    list.push(row)
    localStorage.setItem(KEY, JSON.stringify(list))
  }
}
