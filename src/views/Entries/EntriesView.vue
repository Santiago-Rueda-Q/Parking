<template>
    <section class="space-y-6">
        <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
            <i class="pi pi-sign-in text-2xl text-sky-600"></i>
            <h1 class="text-2xl md:text-3xl font-bold">Fallooooo</h1>
        </div>
        <EntriesHeaderStats :items="headerStats" />
        </div>

        <div class="grid lg:grid-cols-[1fr_420px] gap-6">
        <VehicleForm :modelValue="form":clientOptions="clientOptions" @update:modelValue="onFormUpdate"/>
        <LocationCard v-model="form.slotCode" :grid="grid" @submit="register" />
        </div>

        <ParkedTable :rows="active" @exit="goToExit" />
    </section>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { onActivated } from 'vue'   
import di from '@/services/di'
import { useRouter } from 'vue-router'
import VehicleForm from '@/components/entries/VehicleForm.vue'
import LocationCard from '@/components/entries/LocationCard.vue'
import ParkedTable from '@/components/entries/ParkedTable.vue'
import EntriesHeaderStats from '@/components/entries/EntriesHeaderStats.vue'
import { DEFAULT_CATEGORIES } from '@/Domain/Slots/categories' 


const form = reactive({ plate:'', type:'car', vip:false, disability:false, clientId:null, slotCode:'' })
function onFormUpdate(newVal) {
  // Merge explícito para mantener el mismo objeto reactivo
  Object.assign(form, newVal)
}
const router = useRouter()
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

async function ensureCapacityOrThrow() {
  // 1) Traemos ocupación actual y capacidades configuradas
  const [usedSummary, capacities] = await Promise.all([
    di.entriesService.summaryByType(),
    di.slotsService.getCapacities(),
  ])

  // 2) Tipo de vehículo actual (car, motorcycle, bicycle)
  const typeKey = form.type || 'car'

  const used  = Number(usedSummary[typeKey] || 0)
  const total = Number(capacities[typeKey]   || 0)

  // Si no hay cupos configurados, o total = 0, se considera SIN cupos
  if (total <= 0) {
    throw new Error('No hay cupos configurados para este tipo de vehículo.')
  }

  // 3) Si ya llegamos al límite, bloqueamos el registro
  if (used >= total) {
    throw new Error('No hay cupos disponibles para este tipo de vehículo.')
  }
}

async function register() {
  try {
    // 1) Verificamos capacidad ANTES de intentar registrar
    await ensureCapacityOrThrow()

    // 2) Si hay cupos, seguimos con el flujo normal
    console.log('DEBUG form en register:', JSON.stringify(form))
    await di.entriesService.registerEntry({
      plate: form.plate,
      type: form.type,
      slotCode: form.slotCode,
      vip: !!form.vip,
      disability: !!form.disability,
      client: clientNameById(form.clientId),
    })

    // 3) Limpiar formulario básico y refrescar estado
    form.plate = ''
    form.slotCode = ''
    await refresh()
    alert('Ingreso registrado.')
  } catch (err) {
    // Si no hay cupos, o cualquier otra validación falla, muestra el mensaje
    alert(err.message || 'No se pudo registrar.')
  }
}

function goToExit(plate) {
  router.push({
    path: '/exits',
    query: { plate },
  })
}

onMounted(async () => { await loadClients(); await refresh() })
</script>
