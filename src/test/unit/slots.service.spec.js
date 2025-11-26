import { describe, it, expect } from 'vitest'
import { SlotsService } from '@/services/slots.service'

describe('SlotsService', () => {
    const repo = {
        async load() {
        return [
            { id: 'A1', type: 'car', available: true },
            { id: 'A2', type: 'motorcycle', available: false }
        ]
        }
    }
    const svc = new SlotsService(repo)

    it('devuelve capacidades agrupadas por tipo', async () => {
        const caps = await svc.getCapacities()
        expect(caps.car).toBeDefined()
        expect(caps.motorcycle).toBeDefined()
    })
})
