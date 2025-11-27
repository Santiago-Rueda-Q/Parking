import { describe, it, expect, beforeEach } from 'vitest'
import { EntriesService } from '@/services/entries.service'
import { LocalEntriesRepository } from '@/Infrastructure/Entries/LocalEntriesRepository'
import { ExitsService } from '@/services/exits.service'
import { LocalExitsRepository } from '@/Infrastructure/Exits/LocalExitsRepository'
import { ReportsService } from '@/services/reports.service'

class FakeRatesService {
    billableHours(start, end) {
        return 2
    }
    async pricePerHour() {
        return 5
    }
}

describe('Flujo completo Entrada → Salida → Reporte', () => {
    let entries
    let exits
    let reports

    beforeEach(async () => {
        localStorage.clear()
        entries = new EntriesService(new LocalEntriesRepository())
        exits = new ExitsService(
            new LocalExitsRepository(),
            entries,
            new FakeRatesService()
        )
        // ReportsService hoy recibe el ExitsService real
        reports = new ReportsService(exits, null)
    })

    it('registra entrada, salida y aparece en resumen de reportes', async () => {
        await entries.registerEntry({
            plate: 'XYZ123',
            type: 'car',
            slotCode: 'A1',
        })

        const actives = await entries.listActive()
        expect(actives).toHaveLength(1)

        await exits.processExit('XYZ123')

        const hist = await exits.history()
        expect(hist).toHaveLength(1)

        const summary = await reports.getSummary()
        expect(summary.totalVehicles).toBe(1)
        expect(summary.totalRevenue).toBeGreaterThan(0)
    })
})
