import { describe, it, expect, vi, beforeEach } from 'vitest'
import { EntriesService } from '@/services/entries.service'
import { LocalEntriesRepository } from '@/Infrastructure/Entries/LocalEntriesRepository'

describe('EntriesService', () => {
    let svc
    beforeEach(() => {
        localStorage.clear()
        svc = new EntriesService(new LocalEntriesRepository())
    })

    it('registra placa válida y la lista como activa', async () => {
        const entry = await svc.registerEntry({
        plate: 'abc123',
        type: 'car',
        slotCode: 'A1',
        vip: false,
        disability: false,
        client: 'Cliente Ocasional'
        })
        expect(entry.plate).toBe('ABC-123')
        const list = await svc.listActive()
        expect(list).toHaveLength(1)
        expect(list[0].slotCode).toBe('A1')
    })

    it('permite múltiples SIN-PLT pero no duplica placas reales', async () => {
        await svc.registerEntry({ plate: '', type: 'car', slotCode: 'A1' })       // SIN-PLT
        await svc.registerEntry({ plate: '', type: 'car', slotCode: 'A2' })       // SIN-PLT
        await svc.registerEntry({ plate: 'ABC123', type: 'car', slotCode: 'A3' }) // ABC-123
        await expect(svc.registerEntry({ plate: 'abc-123', type: 'car', slotCode: 'A4' }))
        .rejects.toThrow(/ya tiene un ingreso activo/i)
        const list = await svc.listActive()
        expect(list).toHaveLength(3)
    })
})
