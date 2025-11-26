<template>
  <div class="space-y-6">
    <h2 class="text-xl font-semibold">Configuración de Tarifas</h2>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Carros -->
      <div class="p-4 border rounded-lg shadow">
        <div class="text-center">
          <i class="fas fa-car text-3xl text-blue-600"></i>
          <p class="font-bold mt-2">Carros</p>
          <label>Tarifa por hora (S/.)</label>
          <input v-model="rates.car" type="number" class="border p-2 w-full rounded" />
        </div>
      </div>

      <!-- Motos -->
      <div class="p-4 border rounded-lg shadow">
        <div class="text-center">
          <i class="fas fa-motorcycle text-3xl text-blue-600"></i>
          <p class="font-bold mt-2">Motos</p>
          <label>Tarifa por hora (S/.)</label>
          <input v-model="rates.moto" type="number" class="border p-2 w-full rounded" />
        </div>
      </div>

      <!-- Bicicletas -->
      <div class="p-4 border rounded-lg shadow">
        <div class="text-center">
          <i class="fas fa-bicycle text-3xl text-blue-600"></i>
          <p class="font-bold mt-2">Bicicletas</p>
          <label>Tarifa por hora (S/.)</label>
          <input v-model="rates.bike" type="number" class="border p-2 w-full rounded" />
        </div>
      </div>
    </div>

    <!-- Descuento -->
    <div class="p-4 border rounded-lg shadow">
      <h3 class="font-bold mb-2">Descuentos</h3>
      <label>Descuento para VIP (%)</label>
      <input v-model="rates.vipDiscount" type="number" class="border p-2 w-full rounded" />
    </div>

    <button @click="saveRates" class="bg-blue-600 text-white px-4 py-2 rounded">
      Guardar Configuración
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { getRates, saveRatesConfig } from "@/services/rates.service"

const rates = ref({
  car: 0,
  moto: 0,
  bike: 0,
  vipDiscount: 0
})

onMounted(async () => {
  rates.value = await getRates()
})

async function saveRates() {
  await saveRatesConfig(rates.value)
  alert("Tarifas guardadas correctamente ✅")
}
</script>
