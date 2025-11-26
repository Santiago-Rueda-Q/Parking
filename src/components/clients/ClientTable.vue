<template>
    <div class="rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200/60 dark:border-slate-700">
        <div class="px-5 py-3 border-b border-slate-200/60 dark:border-slate-700 flex items-center justify-between">
        <h3 class="text-lg font-semibold">Lista de Clientes</h3>
        <slot name="search" />
        </div>

        <div class="p-5">
        <DataTable :value="rows" responsiveLayout="scroll" class="w-full">
            <Column field="id" header="ID" style="width:80px" />
            <Column field="name" header="Nombre" />
            <Column field="phone" header="Teléfono" />
            <Column field="email" header="Email" />
            <Column header="Tipo" style="width:120px">
            <template #body="{ data }">
                <i v-if="data.vip" class="pi pi-crown text-amber-500 mr-2" /> {{ data.vip ? 'VIP' : 'Regular' }}
            </template>
            </Column>
            <Column header="Acciones" style="width:140px">
            <template #body="{ data }">
                <Button label="Eliminar" icon="pi pi-trash" severity="danger" @click="$emit('delete', data.id)" />
            </template>
            </Column>
        </DataTable>

        <div class="mt-4 flex items-center justify-end gap-3">
            <Paginator
            :rows="rowsPerPage"
            :totalRecords="total"
            :first="(page-1)*rowsPerPage"
            @page="onPage"
            />
        </div>
        </div>
    </div>
</template>

<script setup>
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Paginator from 'primevue/paginator'

const props = defineProps({
    rows: { type: Array, default: () => [] },
    total: { type: Number, default: 0 },
    page:  { type: Number, default: 1 },     
    rowsPerPage: { type: Number, default: 6 }
})
const emit = defineEmits(['page','delete'])

function onPage(e) {
    const newPage = (e.first / e.rows) + 1
    emit('page', newPage)
}
</script>
