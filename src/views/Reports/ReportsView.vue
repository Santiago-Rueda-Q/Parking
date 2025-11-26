<template>
  <section class="space-y-6">
    <!-- ENCABEZADO -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <i class="pi pi-chart-bar text-2xl text-sky-600"></i>
        <h1 class="text-2xl md:text-3xl font-bold">Reportes</h1>
      </div>

      <div class="flex gap-3">
        <button
          class="px-3 py-1.5 text-sm rounded-lg border border-rose-300 text-rose-700 hover:bg-rose-50"
          @click="clearReports"
        >
          <i class="pi pi-trash mr-2"></i> Limpiar reportes
        </button>
      </div>
    </div>

    <!-- FILTROS POR FECHA -->
    <div
      class="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 flex flex-wrap gap-4 items-end"
    >
      <div>
        <label class="block text-xs font-medium text-slate-500 mb-1"
          >Desde</label
        >
        <input
          v-model="from"
          type="date"
          class="border border-slate-300 rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-slate-900 dark:border-slate-600"
        />
      </div>
      <div>
        <label class="block text-xs font-medium text-slate-500 mb-1"
          >Hasta</label
        >
        <input
          v-model="to"
          type="date"
          class="border border-slate-300 rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-slate-900 dark:border-slate-600"
        />
      </div>
      <div class="flex gap-2">
        <button
          class="px-3 py-1.5 text-sm rounded-lg border border-slate-300 hover:bg-slate-50"
          @click="reload"
        >
          Aplicar filtro
        </button>
        <button
          class="px-3 py-1.5 text-sm rounded-lg border border-slate-300 hover:bg-slate-50"
          @click="setLast30"
        >
          Últimos 30 días
        </button>
      </div>
    </div>

    <!-- TABLA DE HISTÓRICO -->
    <div
      class="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
    >
      <div
        class="px-5 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between"
      >
        <h3 class="font-semibold text-lg flex items-center gap-2">
          <i class="pi pi-list text-sky-600"></i> Histórico de vehículos
          facturados
        </h3>
        <div class="flex flex-col items-end text-xs text-slate-500">
          <div>
            Registros:
            <span class="font-semibold">{{ filteredRows.length }}</span>
          </div>
          <div class="mt-1">
            Total recaudado:
            <span class="font-semibold">
              {{ formatCurrency(totalAmount) }}
            </span>
          </div>
        </div>
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
              v-for="(r, idx) in filteredRows"
              :key="idx"
              class="border-t border-slate-200/70"
            >
              <!-- Placa y tipo (soporta plano o anidado) -->
              <td class="py-2 pr-4">
                {{ r.plate || r.entry?.plate || '—' }}
              </td>
              <td class="py-2 pr-4 capitalize">
                {{ r.type || r.entry?.type || '—' }}
              </td>

              <!-- Hora de ingreso y de salida -->
              <td class="py-2 pr-4">
                {{ fmt(r.entryAt || r.entry?.startedAtISO || r.startedAtISO) }}
              </td>
              <td class="py-2 pr-4">
                {{ fmt(r.exitAt || r.endedAtISO || r.finishedAtISO) }}
              </td>

              <!-- Horas facturadas (usa r.hours o calcula) -->
              <td class="py-2 pr-4">
                <span v-if="r.hours != null">
                  {{ r.hours }}
                </span>
                <span v-else>
                  {{ computeHours(r) }}
                </span>
              </td>

              <!-- Tarifa por hora y total -->
              <td class="py-2 pr-4">
                {{ formatCurrency(r.ratePerHour ?? r.rate ?? 0) }}
              </td>
              <td class="py-2 pr-4 font-semibold">
                {{ formatCurrency(r.total ?? r.amount ?? 0) }}
              </td>

              <!-- Cliente -->
              <td class="py-2 pr-4">
                {{ r.client || r.entry?.client || 'Cliente Ocasional' }}
              </td>
            </tr>

            <tr v-if="!filteredRows.length">
              <td colspan="8" class="py-6 text-center text-slate-400">
                No hay vehículos facturados en el rango seleccionado
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import di from '@/services/di'

const history = ref([]) // histórico crudo de facturados (todas las salidas)
const from = ref('') // filtro desde (YYYY-MM-DD)
const to = ref('') // filtro hasta  (YYYY-MM-DD)

// Cargar histórico desde el servicio
async function loadHistory() {
  if (di.reportsService && typeof di.reportsService.getHistory === 'function') {
    history.value = await di.reportsService.getHistory()
  } else if (di.exitsService && typeof di.exitsService.history === 'function') {
    history.value = await di.exitsService.history()
  } else {
    history.value = []
  }
}

// Filtrado por fechas sobre el histórico completo
const filteredRows = computed(() => {
  if (!from.value && !to.value) return history.value

  const fromDate = from.value ? new Date(from.value) : null
  const toDate = to.value ? new Date(to.value + 'T23:59:59') : null

  return history.value.filter((r) => {
    const raw =
      r.entryAt ||
      r.entry?.startedAtISO ||
      r.startedAtISO ||
      r.exitAt ||
      r.endedAtISO

    if (!raw) return false
    const d = new Date(raw)
    if (Number.isNaN(d.getTime())) return false
    if (fromDate && d < fromDate) return false
    if (toDate && d > toDate) return false
    return true
  })
})

// Total recaudado en el rango filtrado
const totalAmount = computed(() => {
  return filteredRows.value.reduce((acc, r) => {
    const raw = r.total ?? r.amount ?? 0
    const n = Number(raw) || 0
    return acc + n
  }, 0)
})

// Helpers

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
    currency: 'COP'
  })
}

// Si no vienen horas calculadas, las inferimos por diferencia de fechas
function computeHours(r) {
  const startIso =
    r.entryAt || r.entry?.startedAtISO || r.startedAtISO
  const endIso =
    r.exitAt || r.endedAtISO || r.finishedAtISO

  if (!startIso || !endIso) return '—'

  const start = new Date(startIso)
  const end = new Date(endIso)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return '—'

  const ms = end - start
  const hours = ms / 3600000
  return hours.toFixed(2)
}

// Filtro rápido: últimos 30 días
function setLast30() {
  const today = new Date()
  const past = new Date()
  past.setDate(today.getDate() - 30)

  from.value = past.toISOString().slice(0, 10)
  to.value = today.toISOString().slice(0, 10)
}

// Recargar histórico manteniendo filtros activos
async function reload() {
  await loadHistory()
}

// Limpiar reportes
async function clearReports() {
  if (di.reportsService && typeof di.reportsService.clear === 'function') {
    await di.reportsService.clear()
  } else {
    try {
      localStorage.removeItem('pc:exits-history')
      localStorage.removeItem('pc:reports-history')
    } catch (e) {
      console.error(e)
    }
  }
  await loadHistory()
}

// Cargar todo al montar la vista
onMounted(async () => {
  await loadHistory()
  // Si quieres que, por defecto, muestre los últimos 30 días:
  // setLast30()
})
</script>
