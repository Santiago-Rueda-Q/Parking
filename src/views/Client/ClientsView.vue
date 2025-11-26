<template>
    <section class="space-y-6 pt-4 md:pt-6">
        <div class="flex items-center gap-2">
            <i class="pi pi-users text-2xl text-sky-600" />
            <h1 class="text-2xl md:text-3xl font-bold">Gestión de Clientes</h1>
        </div>

        <div class="grid lg:grid-cols-2 gap-5 mt-2">
        <ClientForm @create="onCreate" />

        <ClientTable
            :rows="rows"
            :total="total"
            :page="page"
            :rowsPerPage="rowsPerPage"
            @page="setPage"
            @delete="confirmDelete"
        >
            <template #search>
            <ClientSearch v-model="query" :debounce="300" @search="fetch" />
            </template>
        </ClientTable>
        </div>

        <ConfirmDialog />
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useConfirm } from 'primevue/useconfirm'
import ConfirmDialog from 'primevue/confirmdialog'
import di from '@/services/di'
import ClientForm   from '@/components/clients/ClientForm.vue'
import ClientTable  from '@/components/clients/ClientTable.vue'
import ClientSearch from '@/components/clients/ClientSearch.vue'

const confirm = useConfirm()
const formRef = ref(null)

const query = ref('')
const page = ref(1)
const rowsPerPage = ref(6)
const rows = ref([])
const total = ref(0)

async function fetch() {
    const { items, total: t } = await di.clientsService.searchAndPaginate(query.value, page.value, rowsPerPage.value)
    rows.value = items
    total.value = t
}
function setPage(p) { page.value = p; fetch() }

async function onCreate(payload) {
    try {
        await di.clientsService.create(payload)
        formRef.value?.reset() 
        query.value = ''
        page.value = 1
        await fetch()
        alert('Cliente agregado.')
    } catch (e) {
        alert(e.message || 'No se pudo crear el cliente.')
    }
}

function confirmDelete(id) {
    confirm.require({
        message: '¿Eliminar este cliente?',
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Eliminar',
        rejectLabel: 'Cancelar',
        acceptClass: 'p-button-danger',
        accept: async () => {
        await di.clientsService.delete(id)
        if ((page.value - 1) * rowsPerPage.value >= total.value - 1 && page.value > 1) {
            page.value = page.value - 1
        }
        await fetch()
        },
    })
}

onMounted(fetch)
</script>
