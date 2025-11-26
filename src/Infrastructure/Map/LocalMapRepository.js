import { MapRepository } from '@/Domain/Map/MapRepository'

const KEY = 'pc:map-config'

function safeParse(s){ try { return JSON.parse(s) } catch { return null } }

export class LocalMapRepository extends MapRepository {
    async loadConfig() {
        const raw = localStorage.getItem(KEY)
        return safeParse(raw) || {}
    }
    async saveConfig(cfg) {
        localStorage.setItem(KEY, JSON.stringify(cfg || {}))
    }
}