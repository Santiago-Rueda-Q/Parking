<template>
  <section class="space-y-6">
    <div class="flex items-center gap-3">
      <i class="pi pi-chart-bar text-xl text-sky-400"></i>
      <h1 class="text-2xl md:text-3xl font-bold text-slate-100">Reportes</h1>
    </div>

    <!-- Filtros -->
    <div class="rounded-2xl bg-slate-900/50 border border-slate-700 shadow-sm p-5">
      <div class="grid sm:grid-cols-3 gap-4 items-end">
        <div>
          <label class="block text-sm mb-1 text-slate-300">Desde</label>
          <input type="date" v-model="from" class="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2" />
        </div>
        <div>
          <label class="block text-sm mb-1 text-slate-300">Hasta</label>
          <input type="date" v-model="to" class="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2" />
        </div>
        <div class="flex gap-2">
          <PButton label="Filtrar" @click="load" />
          <PButton label="Hoy" @click="setToday" />
          <PButton label="Últimos 30 días" @click="setLast30" />
        </div>
      </div>
    </div>

    <!-- Resumen -->
    <div class="grid lg:grid-cols-4 gap-4">
      <div class="rounded-xl bg-slate-900/50 border border-slate-700 p-4">
        <div class="text-slate-400 text-sm">Total Movimientos</div>
        <div class="text-2xl font-semibold">{{ stats.totalMovements }}</div>
      </div>
      <div class="rounded-xl bg-slate-900/50 border border-slate-700 p-4">
        <div class="text-slate-400 text-sm">Total Ingresos</div>
        <div class="text-2xl font-semibold">{{ currency }}{{ format(stats.totalRevenue) }}</div>
      </div>
      <div class="rounded-xl bg-slate-900/50 border border-slate-700 p-4">
        <div class="text-slate-400 text-sm">Promedio Diario</div>
        <div class="text-2xl font-semibold">{{ stats.avgPerDay }}</div>
        <div class="text-xs text-slate-500">en {{ stats.period.days }} día(s)</div>
      </div>
      <div class="rounded-xl bg-slate-900/50 border border-slate-700 p-4">
        <div class="text-slate-400 text-sm">Tipos</div>
        <div class="text-sm">Carros: <b>{{ stats.counts.car }}</b></div>
        <div class="text-sm">Motos: <b>{{ stats.counts.moto }}</b></div>
        <div class="text-sm">Bicis: <b>{{ stats.counts.bike }}</b></div>
      </div>
    </div>

    <!-- Tabla -->
    <div class="rounded-2xl bg-slate-900/50 border border-slate-700 shadow-sm">
      <div class="px-5 py-4 border-b border-slate-700 flex items-center gap-2">
        <i class="pi pi-database text-emerald-300"></i>
        <h2 class="text-lg font-semibold text-slate-100">Historial de Movimientos</h2>
        <div class="ml-auto flex gap-2">
          <PButton icon="pi pi-file" label="Exportar CSV" @click="onExport" />
          <PButton icon="pi pi-print" label="Imprimir" @click="window.print()" />
        </div>
      </div>
      <div class="p-5 overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="text-slate-300">
            <tr class="text-left">
              <th class="py-2 pr-4">Placa</th>
              <th class="py-2 pr-4">Tipo</th>
              <th class="py-2 pr-4">Ubicación</th>
              <th class="py-2 pr-4">Ingreso</th>
              <th class="py-2 pr-4">Salida</th>
              <th class="py-2 pr-4">Tiempo</th>
              <th class="py-2 pr-4">Cliente</th>
              <th class="py-2 pr-4">VIP</th>
              <th class="py-2 pr-4">Monto</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!stats.rows.length">
              <td colspan="9" class="py-6 text-center text-slate-500">No hay movimientos en el período seleccionado</td>
            </tr>
            <tr v-for="(r, idx) in stats.rows" :key="idx" class="border-t border-slate-800">
              <td class="py-2 pr-4">{{ r.plate }}</td>
              <td class="py-2 pr-4">{{ r.type }}</td>
              <td class="py-2 pr-4">{{ r.space ?? '' }}</td>
              <td class="py-2 pr-4">{{ dt(r.entryAt) }}</td>
              <td class="py-2 pr-4">{{ dt(r.exitAt) }}</td>
              <td class="py-2 pr-4">{{ r.hours }} h ({{ r.minutes }} min)</td>
              <td class="py-2 pr-4">{{ r.client || '—' }}</td>
              <td class="py-2 pr-4">{{ r.isVip ? 'Sí' : 'No' }}</td>
              <td class="py-2 pr-4 font-semibold">{{ currency }}{{ format(r.amount) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import di from '@/services/di'

const currency = ref('$')

const stats = reactive({
  totalMovements: 0,
  totalRevenue: 0,
  avgPerDay: 0,
  counts: { car: 0, moto: 0, bike: 0 },
  rows: [],
  period: { from: null, to: null, days: 0 }
})

const from = ref('')
const to   = ref('')

// helpers
function pad(n){ return String(n).padStart(2,'0') }
function todayStr(d=new Date()){ return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}` }
function addDays(date, n){ const x=new Date(date); x.setDate(x.getDate()+n); return x }
function dt(d){ return d ? new Date(d).toLocaleString() : '' }
function format(n){ return Number(n ?? 0).toFixed(2) }

function setToday(){ const t=new Date(); from.value=todayStr(t); to.value=todayStr(t); load() }
function setLast30(){ const t=new Date(); from.value=todayStr(addDays(t,-29)); to.value=todayStr(t); load() }

async function load(){
  const s = await di.settingsService.load().catch(()=>null)
  currency.value = s?.currencySymbol ?? '$'
  const res = await di.reportsService.computeStats({
    from: from.value || null,
    to: to.value || null,
    rounding: 'ceil'
  })
  Object.assign(stats, res)
}
function onExport(){ di.reportsService.exportCSV(stats, 'reporte-movimientos.csv', currency.value) }

onMounted(async () => {
  // Fallback por si no se inyectó en di.js (no romper UI)
  if (!di.reportsService) {
    const { ReportsService } = await import('@/services/reports.service')
    di.reportsService = new ReportsService(di.entriesService, di.ratesService)
  }
  setLast30()
})
</script>
