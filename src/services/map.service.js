// src/services/map.service.js
const A_CODE = 'A'.charCodeAt(0)

export class MapService {
    /**
     * @param {import('@/Domain/Map/MapRepository').MapRepository} mapRepo
     * @param {import('@/services/entries.service').EntriesService} entriesService
     */
    constructor(mapRepo, entriesService) {
        this.mapRepo = mapRepo
        this.entriesService = entriesService
    }

    async getConfig() {
        const repo = this.mapRepo
        const raw  = repo?.loadConfig ? await repo.loadConfig() : {}
        const cfg  = raw || {}
        return {
        rows: Math.max(1, Number(cfg.rows || 1)),
        cols: Math.max(1, Number(cfg.cols || 1)),
        vip: Array.isArray(cfg.vip) ? cfg.vip : [],
        disability: Array.isArray(cfg.disability) ? cfg.disability : [],
        }
    }

    async saveConfig({ rows, cols, vip = [], disability = [] }) {
        const cfg = {
        rows: Math.max(1, rows|0),
        cols: Math.max(1, cols|0),
        vip,
        disability
        }
        if (this.mapRepo?.saveConfig) await this.mapRepo.saveConfig(cfg)
        return cfg
    }

    generateCodes(rows, cols) {
        const cells = []
        for (let r = 0; r < rows; r++) {
        const prefix = String.fromCharCode(A_CODE + r)
        for (let c = 1; c <= cols; c++) {
            cells.push(`${prefix}${c}`)
        }
        }
        return cells
    }

    async getGrid() {
        const cfg     = await this.getConfig()
        const codes   = this.generateCodes(cfg.rows, cfg.cols)

        const active  = await this.entriesService.listActive()
        const busy    = new Set(active.map(e => String(e.slotCode || '').toUpperCase().trim()))
        const vipSet  = new Set((cfg.vip || []).map(x => String(x).toUpperCase().trim()))
        const disSet  = new Set((cfg.disability || []).map(x => String(x).toUpperCase().trim()))

        return codes.map(code => {
        const up = String(code).toUpperCase().trim()
        return {
            code,
            isOccupied:  busy.has(up),
            isVip:       vipSet.has(up),
            isDisability: disSet.has(up),
        }
        })
    }

    async toggleVip(code) {
        const cfg = await this.getConfig()
        const up  = String(code).toUpperCase().trim()
        const set = new Set(cfg.vip.map(x => String(x).toUpperCase().trim()))
        set.has(up) ? set.delete(up) : set.add(up)
        cfg.vip = Array.from(set)
        await this.saveConfig(cfg)
        return cfg
    }

    async toggleDisability(code) {
        const cfg = await this.getConfig()
        const up  = String(code).toUpperCase().trim()
        const set = new Set(cfg.disability.map(x => String(x).toUpperCase().trim()))
        set.has(up) ? set.delete(up) : set.add(up)
        cfg.disability = Array.from(set)
        await this.saveConfig(cfg)
        return cfg
    }
}
