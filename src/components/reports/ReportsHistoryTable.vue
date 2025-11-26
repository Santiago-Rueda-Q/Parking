<template>
  <div class="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
    <div class="px-5 py-3 border-b border-slate-200 dark:border-slate-700">
      <h3 class="font-semibold text-lg flex items-center gap-2">
        <i class="pi pi-history text-sky-600"></i> Histórico de vehículos facturados
      </h3>
    </div>

    <div class="p-5 overflow-x-auto">
      <table class="min-w-full text-sm">
        <thead class="text-left text-slate-500">
          <tr>
            <th class="py-2 pr-4">Placa</th>
            <th class="py-2 pr-4">Tipo</th>
            <th class="py-2 pr-4">Ingreso</th>
            <th class="py-2 pr-4">Salida</th>
            <th class="py-2 pr-4">Horas</th>
            <th class="py-2 pr-4">Tarifa/Hora</th>
            <th class="py-2 pr-4">Total</th>
            <th class="py-2 pr-4">Cliente</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="r in rows"
            :key="r.id || r.endedAtISO"
            class="border-t border-slate-200/70"
          >
            <!-- 🔹 Placa y tipo vienen del entry original -->
            <td class="py-2 pr-4">{{ r.entry?.plate || '—' }}</td>
            <td class="py-2 pr-4 capitalize">{{ r.entry?.type || '—' }}</td>

            <!-- 🔹 Hora de ingreso y de salida -->
            <td class="py-2 pr-4">{{ fmt(r.entry?.startedAtISO) }}</td>
            <td class="py-2 pr-4">{{ fmt(r.endedAtISO) }}</td>

            <!-- 🔹 Horas facturadas (del cálculo de salida) -->
            <td class="py-2 pr-4">{{ r.hours ?? '—' }}</td>

            <!-- 🔹 Tarifa por hora y total facturado -->
            <td class="py-2 pr-4">{{ formatCurrency(r.ratePerHour ?? 0) }}</td>
            <td class="py-2 pr-4 font-semibold">
              {{ formatCurrency(r.total ?? 0) }}
            </td>

            <!-- 🔹 Cliente -->
            <td class="py-2 pr-4">{{ r.entry?.client || 'Cliente Ocasional' }}</td>
          </tr>

          <tr v-if="!rows?.length">
            <td colspan="8" class="py-6 text-center text-slate-400">
              Sin vehículos facturados todavía
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
defineProps({
  // rows = historial de salidas ya facturadas
  rows: { type: Array, default: () => [] },
})

function fmt(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString()
}

function formatCurrency(value) {
  const n = Number(value) || 0
  return n.toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
  })
}
</script>
