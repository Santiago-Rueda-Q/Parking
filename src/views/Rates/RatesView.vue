```vue
<template>
  <section class="space-y-6 pt-4 md:pt-6 text-gray-100">
    <div class="flex items-center gap-2">
      <i class="pi pi-money-bill text-2xl text-emerald-400" />
      <h1 class="text-2xl md:text-3xl font-bold">Tarifas</h1>
    </div>

    <div class="p-6 rounded-xl shadow-md border border-emerald-600 bg-[#0f1a1a]">
      <h2 class="text-lg font-semibold mb-5 flex items-center gap-2 text-emerald-300">
        <i class="pi pi-tags"></i> Configuración de Tarifas
      </h2>

      <div class="grid md:grid-cols-3 gap-6 mb-6">
        <div class="p-5 rounded-xl border border-emerald-600 bg-[#152525] flex flex-col items-center text-center">
          <i class="pi pi-car text-5xl text-emerald-400 mb-3"></i>
          <h3 class="text-lg font-semibold">Carros</h3>
          <label class="mt-2 text-sm text-gray-300">Tarifa por hora (S/.)</label>
          <input
            type="number"
            v-model="rates.car"
            class="mt-2 p-2 w-24 text-center border border-emerald-700 rounded-md focus:ring-2 focus:ring-emerald-400 focus:outline-none bg-[#0b1212] text-gray-100"
          />
        </div>

        <div class="p-5 rounded-xl border border-emerald-600 bg-[#152525] flex flex-col items-center text-center">
          <i class="pi pi-motorcycle text-5xl text-emerald-400 mb-3"></i>
          <h3 class="text-lg font-semibold">Motos</h3>
          <label class="mt-2 text-sm text-gray-300">Tarifa por hora (S/.)</label>
          <input
            type="number"
            v-model="rates.moto"
            class="mt-2 p-2 w-24 text-center border border-emerald-700 rounded-md focus:ring-2 focus:ring-emerald-400 focus:outline-none bg-[#0b1212] text-gray-100"
          />
        </div>

        <div class="p-5 rounded-xl border border-emerald-600 bg-[#152525] flex flex-col items-center text-center">
          <i class="pi pi-bicycle text-5xl text-emerald-400 mb-3"></i>
          <h3 class="text-lg font-semibold">Bicicletas</h3>
          <label class="mt-2 text-sm text-gray-300">Tarifa por hora (S/.)</label>
          <input
            type="number"
            v-model="rates.bike"
            class="mt-2 p-2 w-24 text-center border border-emerald-700 rounded-md focus:ring-2 focus:ring-emerald-400 focus:outline-none bg-[#0b1212] text-gray-100"
          />
        </div>
      </div>

      <div class="p-5 rounded-xl border border-emerald-600 bg-[#152525]">
        <h3 class="text-md font-semibold flex items-center gap-2 mb-3 text-emerald-300">
          <i class="pi pi-percentage"></i> Descuentos
        </h3>

        <label class="text-sm text-gray-300">Descuento para VIP (%)</label>
        <input
          type="number"
          v-model="rates.vipDiscount"
          class="mt-2 p-2 w-28 text-center border border-emerald-700 rounded-md focus:ring-2 focus:ring-emerald-400 focus:outline-none bg-[#0b1212] text-gray-100"
        />
      </div>

      <div class="flex justify-end mt-6">
        <button
          @click="saveConfig"
          class="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md font-medium flex items-center gap-2 transition-all shadow-md"
        >
          <i class="pi pi-save"></i> Guardar Configuración
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import di from '@/services/di'

const rates = ref({
  car: 0,
  moto: 0,
  bike: 0,
  vipDiscount: 0
})

async function loadRates() {
  const data = di.ratesRepository.getRates()
  rates.value = data
}

function saveConfig() {
  di.ratesRepository.saveRates(rates.value)
  alert('Configuración de tarifas guardada correctamente.')
}

onMounted(loadRates)
</script>
```
