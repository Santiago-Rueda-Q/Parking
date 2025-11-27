// src/test/components/SettingsForm.spec.js
import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'

// 🧪 Mock de '@/services/di' para que settingsService exista en los tests
vi.mock('@/services/di', () => {
  return {
    default: {
      settingsService: {
        load: vi.fn().mockResolvedValue({
          businessName: 'Parqueadero Test',
          currencySymbol: '$',
          theme: 'light',
        }),
      },
    },
  }
})

import SettingsForm from '@/components/Settings/SettingsForm.vue'

describe('SettingsForm', () => {
  it('renderiza campos básicos', async () => {
    const wrapper = mount(SettingsForm, {
      global: {
        stubs: {
          // PrimeVue y otros componentes usados en el template
          PButton: true,
          Button: true,
          InputText: true,
          Dropdown: true,
          Checkbox: true,
          InputNumber: true,
          // si aparece algún componente más en el template, se agrega aquí
        },
      },
    })

    // Esperamos a que se resuelvan los async del mounted (load de settings)
    await flushPromises()

    expect(wrapper.text()).toMatch(/Nombre/i)
    expect(wrapper.text()).toMatch(/Moneda|Monetaria|Símbolo/i)
  })
})
