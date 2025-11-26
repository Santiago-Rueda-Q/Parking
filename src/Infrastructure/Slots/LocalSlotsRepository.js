import { SlotsRepository } from '@/Domain/Slots/SlotsRepository'

const STORAGE_KEY = 'pc:slots-config'

export class LocalSlotsRepository extends SlotsRepository {
    async load() {
        const raw = localStorage.getItem(STORAGE_KEY)
        return raw ? JSON.parse(raw) : {}
    }
    async save(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data || {}))
    }
}
