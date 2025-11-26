import { describe, it, expect, beforeEach } from 'vitest'
import { EntriesService } from '@/services/entries.service'
import { LocalEntriesRepository } from '@/Infrastructure/Entries/LocalEntriesRepository'
import { ExitsService } from '@/services/exits.service'
import { LocalExitsRepository } from '@/Infrastructure/Exits/LocalExitsRepository'
import { ReportsService } from '@/services/reports.service'

class FakeRatesService {
    billableHours(start, end) { return 2 }
    async pricePerHour() { return 5 }
    }

    describe('Flujo completo Entrada → Salida → Reporte', () => {
    let entries, exits, reports

    beforeEach(async () => {
        localStorage.clear()
        entries = new EntriesService(new LocalEntriesRepository())
        exits   = new ExitsService(new LocalExitsRepository(), entries, new FakeRatesService())
        reports = new ReportsService(exits, { load: async () => ({ carPerHour: 5 }) })
    })

    it('registra entrada, salida y aparece en reportes', async () => {
        await entries.registerEntry({ plate: 'XYZ123', type: 'car', slotCode: 'A1' })
        const actives = await entries.listActive()
        expect(actives).toHaveLength(1)

        await exits.processExit('XYZ123')
        const hist = await exits.history()
        expect(hist).toHaveLength(1)

        const stats = await reports.computeStats()
        expect(stats.totalRevenue).toBeGreaterThan(0)
    })
})
