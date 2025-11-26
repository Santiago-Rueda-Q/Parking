import { describe, it, expect } from 'vitest'
import { normalizePlate, isAnonymousPlate } from '@/Domain/Entries/plate.utils.js'

describe('normalizePlate', () => {
    it('acepta AAA-123 tal cual', () => {
        expect(normalizePlate('Abc-123')).toBe('ABC-123')
    })
    it('normaliza ABC123', () => {
        expect(normalizePlate('abc123')).toBe('ABC-123')
    })
    it('acepta SIN-PLT', () => {
        expect(isAnonymousPlate('sin-plt')).toBe(true)
        expect(normalizePlate('SIN-PLT')).toBe('SIN-PLT')
    })
    it('lanza si formato inválido', () => {
        expect(() => normalizePlate('AB-12')).toThrow(/Formato de placa inválido/i)
    })
})
