// src/test/components/SettingsForm.spec.js
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import SettingsForm from '@/components/Settings/SettingsForm.vue'

describe('SettingsForm', () => {
  it('renderiza campos básicos', () => {
    const wrapper = mount(SettingsForm, {
      global: {
        stubs: {
          // PrimeVue y amigos
          PButton: true,
          Button: true,
          InputText: true,
          Dropdown: true,
          Checkbox: true,
          InputNumber: true,
          // si apareciera algo más en el template, agréguelo acá
        }
      }
    })
    expect(wrapper.text()).toMatch(/Nombre/i)
    expect(wrapper.text()).toMatch(/Moneda|Monetaria|Símbolo/i)
  })
})
