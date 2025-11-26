<template>
    <section class="space-y-6">
        <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
            <i class="pi pi-sign-in text-2xl text-sky-600"></i>
            <h1 class="text-2xl md:text-3xl font-bold">Registrar Ingreso</h1>
        </div>
        <EntriesHeaderStats :items="headerStats" />
        </div>

        <div class="grid lg:grid-cols-[1fr_420px] gap-6">
        <VehicleForm v-model="form" :clientOptions="clientOptions" />
        <LocationCard v-model="form.slotCode" :grid="grid" @submit="register" />
        </div>

        <ParkedTable :rows="active" @exit="goToExit" />
    </section>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { onActivated } from 'vue'   
import di from '@/services/di'
import VehicleForm from '@/components/entries/VehicleForm.vue'
import LocationCard from '@/components/entries/LocationCard.vue'
import ParkedTable from '@/components/entries/ParkedTable.vue'
import EntriesHeaderStats from '@/components/entries/EntriesHeaderStats.vue'
import { DEFAULT_CATEGORIES } from '@/Domain/Slots/categories' 

const form = reactive({ plate:'', type:'car', vip:false, disability:false, clientId:null, slotCode:'' })
const clientOptions = ref([])      
const clients = ref([])
const grid = ref([])               
const active = ref([])             
const headerStats = ref([])        

async function loadClients(){
    clients.value = await di.clientsService.list()
    clientOptions.value = clients.value.map(c => ({ id:c.id, name: c.vip ? `${c.name} (VIP)` : c.name }))
}

async function computeHeader() {
    const used  = await di.entriesService.summaryByType()
    const total = await di.slotsService.getCapacities()

    const dict = {
        car:        { icon:'pi pi-car' },
        motorcycle: { icon:'pi pi-motorcycle' },
        bicycle:    { icon:'pi pi-bicycle' },
        vip:        { icon:'pi pi-crown' },
        disability: { icon:'pi pi-wheelchair' },
    }

    headerStats.value = Object.keys(dict).map(k => ({
        key: k,
        used:  Number(used[k]  || 0),
        total: Number(total[k] || 0),
        icon: dict[k].icon
    }))
}

async function refresh(){
    grid.value   = await di.mapService.getGrid()  
    active.value = await di.entriesService.listActive()
    await computeHeader()
}

function clientNameById(id){
    return clients.value.find(c => c.id===id)?.name || 'Cliente Ocasional'
}

async function register(){
    try{
        await di.entriesService.registerEntry({
            plate: form.plate,
            type: form.type,
            slotCode: form.slotCode,
            vip: !!form.vip,
            disability: !!form.disability,
            client: clientNameById(form.clientId),
        })
        form.plate = ''
        form.slotCode = ''
        await refresh()
        alert('Ingreso registrado.')
    }catch(err){
        alert(err.message || 'No se pudo registrar.')
    }
}

function goToExit(plate){
    const url = `/exits?plate=${encodeURIComponent(plate)}`
    window.history.pushState({}, '', url)

}

onMounted(async () => { await loadClients(); await refresh() })
</script>
