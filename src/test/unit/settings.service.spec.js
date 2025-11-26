import { describe, it, expect, vi } from 'vitest'
import { SettingsService } from '@/services/settings.service'

describe('SettingsService', () => {
    const repo = {
        async load() { return { currencySymbol: '€', printing: { footerText: 'Bye' } } },
        async save(x) { this._saved = x }
    }
    const svc = new SettingsService(repo)

    it('normaliza y aplica valores por defecto', async () => {
        const conf = await svc.load()
        expect(conf.currencySymbol).toBe('€')
        expect(conf.appName).toBe('ParkControl')
        expect(conf.features.enableVip).toBe(true)
    })

    it('emite eventos al guardar', async () => {
        const fn = vi.fn()
        svc.subscribe(fn)
        await svc.save({ appName: 'MiParqueo' })
        expect(fn).toHaveBeenCalled()
    })
})
