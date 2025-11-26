<template>
  <section class="space-y-6">
    <div class="flex items-center gap-2">
      <i class="pi pi-sign-out text-2xl text-sky-600" />
      <h1 class="text-2xl md:text-3xl font-bold">Registrar Salida</h1>
    </div>

    <div class="grid lg:grid-cols-2 gap-6">
      <div class="space-y-6">
        <SearchActive v-model="query" :found="selectedEntry" @enter="selectByQuery" />

        <ActiveTable
          :rows="rows" :total="total" :page="page" :rowsPerPage="rowsPerPage" :query="query"
          @page="p => { page = p; fetch() }"
          @search="v => { query = v.toUpperCase(); page = 1; fetch() }"
          @select="onSelect"
        />
      </div>

      <InvoiceCard :invoice="invoice" :settings="settings" @process="processExit" />
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import di from '@/services/di'
import SearchActive from '@/components/exits/SearchActive.vue'
import ActiveTable from '@/components/exits/ActiveTable.vue'
import InvoiceCard from '@/components/exits/InvoiceCard.vue'

const query = ref('')
const page = ref(1)
const rowsPerPage = ref(6)
const rows = ref([])
const total = ref(0)

const selectedEntry = ref(null)
const invoice = ref(null)
const settings = ref(null)

async function fetch(){
  const { items, total: t } = await di.exitsService.listActiveFiltered(query.value, page.value, rowsPerPage.value)
  rows.value = items
  total.value = t
  if (selectedEntry.value) {
    const still = items.find(e => e.plate === selectedEntry.value.plate)
    if (!still) { selectedEntry.value = null; invoice.value = null }
  }
}

async function onSelect(plate) {
  selectedEntry.value = await di.exitsService.findActiveByPlate(plate)
  invoice.value = await di.exitsService.buildInvoice(plate)
}
async function selectByQuery(){
  if (!query.value) return
  await onSelect(query.value)
}

async function processExit(){
  if (!invoice.value?.entry?.plate) return
  await di.exitsService.processExit(invoice.value.entry.plate)
  selectedEntry.value = null
  invoice.value = null
  await fetch()
}

onMounted(async () => {
  settings.value = await di.settingsService.load().catch(()=>null)
  await fetch()
})
</script>
