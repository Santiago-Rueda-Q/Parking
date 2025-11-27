import { describe, it, expect, beforeEach } from 'vitest'
import { EntriesService } from '@/services/entries.service.js'

/**
 * Repo en memoria simple para pruebas.
 * Implementa solo lo que EntriesService usa: listActive, add, removeByPlate.
 */
class InMemoryEntriesRepo {
    constructor() {
        /** @type {Array<any>} */
        this.items = []
    }

    async listActive() {
        return this.items
    }

    async add(entry) {
        this.items.push(entry)
    }

    async removeByPlate(plate) {
        const idx = this.items.findIndex(e => e.plate === plate)
        if (idx >= 0) {
            const [removed] = this.items.splice(idx, 1)
            return removed
        }
        return null
    }
}

describe('EntriesService', () => {
    /** @type {EntriesService} */
    let svc
    /** @type {InMemoryEntriesRepo} */
    let repo

    beforeEach(() => {
        repo = new InMemoryEntriesRepo()
        svc = new EntriesService(repo)
    })

    it('registra placa válida y la lista como activa', async () => {
        // act
        const entry = await svc.registerEntry({
            plate: 'ABC123',
            type: 'car',
            slotCode: 'A1',
            vip: false,
            disability: false,
            client: 'Cliente Ocasional',
        })

        // assert
        expect(entry.plate).toBe('ABC-123')
        const list = await svc.listActive()
        expect(list).toHaveLength(1)
        expect(list[0].slotCode).toBe('A1')
        expect(list[0].type).toBe('car')
    })

    it('rechaza entradas sin placa con el mensaje correcto', async () => {
        await expect(
            svc.registerEntry({
                plate: '', // <- sin placa
                type: 'car',
                slotCode: 'A2',
                vip: false,
                disability: false,
                client: 'Cliente Ocasional',
            }),
        ).rejects.toThrow('La placa es obligatoria.')
    })

    it('no permite placas reales duplicadas', async () => {
        // primera entrada
        await svc.registerEntry({
            plate: 'XYZ999',
            type: 'car',
            slotCode: 'B1',
            vip: false,
            disability: false,
            client: 'Cliente Ocasional',
        })

        // segunda con misma placa -> debe fallar
        await expect(
            svc.registerEntry({
                plate: 'XYZ999',
                type: 'car',
                slotCode: 'B2',
                vip: false,
                disability: false,
                client: 'Cliente Ocasional',
            }),
        ).rejects.toThrow('La placa ya tiene un ingreso activo.')
    })
})
