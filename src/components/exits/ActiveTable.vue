<template>
    <div class="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 shadow-sm">
        <div class="px-5 py-3 border-b border-slate-200/60 dark:border-slate-700 flex items-center justify-between">
        <h3 class="text-lg font-semibold">Vehículos en Estacionamiento</h3>
        <div class="flex items-center gap-2">
            <InputText v-model="q" placeholder="Buscar placa..." />
            <Button icon="pi pi-search" @click="emit('search', q)" />
        </div>
        </div>

        <div class="p-5">
        <DataTable :value="rows" responsiveLayout="scroll" class="w-full" @row-click="onRow">
            <Column field="plate" header="Placa" />
            <Column field="type" header="Tipo" />
            <Column field="slotCode" header="Ubicación" />
            <Column header="Ingreso" :body="d => new Date(d.startedAtISO).toLocaleString()" />
        </DataTable>

        <div class="mt-4 flex items-center justify-end">
            <Paginator :rows="rowsPerPage" :totalRecords="total" :first="(page-1)*rowsPerPage" @page="onPage"/>
        </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Paginator from 'primevue/paginator'

const props = defineProps({ rows:Array, total:Number, page:Number, rowsPerPage:{type:Number,default:6}, query:String })
const emit = defineEmits(['page','select','search'])

const q = ref(props.query || '')
watch(q, v => emit('search', v), { debounce: 300 })

function onPage(e){ emit('page', (e.first/e.rows)+1) }
function onRow(e){ emit('select', e.data.plate) }
</script>
