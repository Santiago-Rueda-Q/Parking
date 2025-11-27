import { describe, it, expect } from 'vitest'
import { ReportsService } from '@/services/reports.service'

// Fake ExitsService que devuelve un historial controlado
class FakeExitsService {
    constructor(history) {
        this._history = history
    }

    async history() {
        return this._history
    }
}

describe('ReportsService', () => {
    it('calcula totales y resumen a partir del historial', async () => {
        const now = new Date()
        const entryAt = new Date(now.getTime() - 2 * 3600000).toISOString() // 2h antes
        const exitAt = now.toISOString()

        const history = [
            {
                entry: {
                    plate: 'ABC-123',
                    type: 'car',
                    client: 'X',
                    startedAtISO: entryAt,
                },
                endedAtISO: exitAt,
                hours: 2,
                ratePerHour: 5,
                total: 10,
            },
        ]

        const exitsService = new FakeExitsService(history)

        // reports.service.js hoy recibe (exitsService, ratesService)
        const svc = new ReportsService(exitsService, null)

        const summary = await svc.getSummary()
        expect(summary.totalVehicles).toBe(1)
        expect(summary.totalRevenue).toBe(10)
        expect(summary.byType.car).toBe(1)

        const hist = await svc.getHistory()
        expect(hist).toHaveLength(1)
        expect(hist[0].entry.plate).toBe('ABC-123')
    })
})
