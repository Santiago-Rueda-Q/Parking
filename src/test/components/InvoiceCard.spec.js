import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import InvoiceCard from '@/components/exits/InvoiceCard.vue'

describe('InvoiceCard', () => {
    it('muestra símbolo de moneda y datos de negocio desde settings', () => {
        const wrapper = mount(InvoiceCard, {
        props: {
            settings: { appName: 'MiParqueo', currencySymbol: 'S/.', businessAddress: 'Calle 1', businessPhone: '123' },
            invoice: {
            entry: { plate:'ABC-123', type:'car', slotCode:'A1', client:'Cliente', startedAtISO: new Date().toISOString() },
            endedAtISO: new Date().toISOString(),
            hours: 2,
            ratePerHour: 5,
            total: 10
            }
        },
        global: { stubs: { Button: true } } // PrimeVue
        })
        expect(wrapper.text()).toContain('MiParqueo')
        expect(wrapper.text()).toContain('Calle 1')
        expect(wrapper.text()).toContain('123')
        expect(wrapper.text()).toMatch(/S\/\.\s?(10[,\.]00)/)
    })
})
