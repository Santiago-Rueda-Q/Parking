import { describe, it, expect, beforeEach } from 'vitest'
import { EntriesService } from '@/services/entries.service'
import { LocalEntriesRepository } from '@/Infrastructure/Entries/LocalEntriesRepository'
import { ExitsService } from '@/services/exits.service'
import { LocalExitsRepository } from '@/Infrastructure/Exits/LocalExitsRepository'

/** Fake RatesService mínimo */
class FakeRatesService {
    billableHours(startISO, endISO) {
        const ms = new Date(endISO) - new Date(startISO)
        return +(ms / 3600000).toFixed(2)
    }
    async pricePerHour(type, { vip }) {
        const base = type === 'motorcycle' ? 3 : type === 'bicycle' ? 1 : 5
        return vip ? base * 0.9 : base
    }
}

describe('ExitsService', () => {
    let entries, exits, rates, svc

    beforeEach(async () => {
        localStorage.clear()
        entries = new EntriesService(new LocalEntriesRepository())
        exits   = new LocalExitsRepository()
        rates   = new FakeRatesService()
        svc     = new ExitsService(exits, entries, rates)

        // seed: un ingreso activo
        const start = new Date(Date.now() - 90 * 60 * 1000).toISOString() // hace 90 min
        await entries.registerEntry({ plate: 'ABC123', type: 'car', slotCode: 'A1' })
        // sobreescribir el startedAtISO para control
        const list = await entries.listActive()
        list[0].startedAtISO = start
        localStorage.setItem('pc:entries-active', JSON.stringify(list))
    })

    it('construye factura y procesa salida, moviendo a histórico', async () => {
        const invoice = await svc.buildInvoice('abc-123')
        expect(invoice.entry.plate).toBe('ABC-123')
        expect(invoice.ratePerHour).toBeGreaterThan(0)
        expect(invoice.total).toBeGreaterThan(0)

        await svc.processExit('ABC123')
        const remaining = await entries.listActive()
        expect(remaining).toHaveLength(0)

        const hist = await svc.history()
        expect(hist).toHaveLength(1)
        expect(hist[0].plate).toBe('ABC-123')
        expect(hist[0].exitAt).toBeTruthy()
        expect(hist[0].total).toBeGreaterThan(0)
    })
})
