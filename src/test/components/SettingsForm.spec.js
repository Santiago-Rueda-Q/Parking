// src/test/components/SettingsForm.spec.js
import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'

// 🧪 Mock de '@/services/di' para que settingsService exista en los tests
vi.mock('@/services/di', () => {
  const loadMock = vi.fn().mockResolvedValue({
    businessName: 'Parqueadero Test',
    currencySymbol: '$',
    theme: 'light',
  })

  const subscribeMock = vi.fn().mockReturnValue(() => {
    // noop: función de desuscripción vacía
  })

  return {
    default: {
      settingsService: {
        load: loadMock,
        subscribe: subscribeMock,
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
        },
      },
    })

    // Esperar a que se resuelvan los async del mounted (load + subscribe)
    await flushPromises()

    expect(wrapper.text()).toMatch(/Nombre/i)
    expect(wrapper.text()).toMatch(/Moneda|Monetaria|Símbolo/i)
  })
})
