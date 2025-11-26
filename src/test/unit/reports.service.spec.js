import { describe, it, expect, beforeEach } from 'vitest'
import { ReportsService } from '@/services/reports.service'

describe('ReportsService', () => {
    let svc
    beforeEach(() => {
        localStorage.clear()
        const now = new Date()
        const entryAt = new Date(now.getTime() - 2 * 3600000).toISOString() // 2h
        const exitAt  = now.toISOString()
        localStorage.setItem('pc:exits-history', JSON.stringify([{
        plate: 'ABC-123', type: 'car', space: 'A1', client: 'X', isVip: false,
        entryAt, exitAt
        }]))
        svc = new ReportsService(null, { load: async () => ({ carPerHour: 5, motoPerHour: 3, bikePerHour: 1, vipDiscountPercent: 0 }) })
    })

    it('calcula totales y filas', async () => {
        const stats = await svc.computeStats()
        expect(stats.totalMovements).toBe(1)
        expect(stats.totalRevenue).toBeGreaterThan(0)
        expect(stats.rows[0].plate).toBe('ABC-123')
    })
})
