import { ClientsRepository } from '@/Domain/Clients/ClientsRepository'

const STORAGE_KEY = 'pc:clients'

export class LocalClientsRepository extends ClientsRepository {
    async listAll() {
        const raw = localStorage.getItem(STORAGE_KEY)
        return raw ? JSON.parse(raw) : []
    }
    async create(data) {
        const list = await this.listAll()
        const nextId = (list.reduce((m, c) => Math.max(m, Number(c.id || 0)), 0) || 0) + 1
        const row = { id: nextId, name: data.name, phone: data.phone || '', email: data.email || '', vip: !!data.vip }
        list.push(row)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
        return row
    }
    async delete(id) {
        const list = await this.listAll()
        const next = list.filter(c => Number(c.id) !== Number(id))
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        return list.length - next.length
    }
}
