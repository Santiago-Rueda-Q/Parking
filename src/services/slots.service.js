// src/services/slots.service.js
import { DEFAULT_CATEGORIES } from '@/Domain/Slots/categories'

export class SlotsService {
    constructor(repo) { this.repo = repo }

    normalize(config) {
        const base = { car:0, motorcycle:0, bicycle:0, vip:0, disability:0 }

        if (Array.isArray(config)) {
        const out = { ...base }
        for (const it of config) {
            if (it && typeof it.key === 'string' && it.key in out) {
            out[it.key] = Number(it.value) || 0
            }
        }
        return out
        }

        const src = (config && (config.capacities || config.slots)) || config || {}
        return {
        car:        Number(src.car)        || 0,
        motorcycle: Number(src.motorcycle) || 0,
        bicycle:    Number(src.bicycle)    || 0,
        vip:        Number(src.vip)        || 0,
        disability: Number(src.disability) || 0,
        }
    }

    async load()  { return this.normalize(await this.repo.load()) }
    async save(d) { const n = this.normalize(d); await this.repo.save(n); return n }

    async getCapacities() { return await this.load() }
    async getCategoriesWithValues() {
        const caps = await this.getCapacities()
        return DEFAULT_CATEGORIES.map(c => ({ ...c, value: Number(caps[c.key] || 0) }))
    }

    async saveConfig(data){ return this.save(data) } // alias usado por tus componentes
}
