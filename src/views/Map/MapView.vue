<template>
    <section class="space-y-6">
        <div class="flex items-center gap-2">
            <i class="pi pi-map text-2xl text-sky-600"></i>
            <h1 class="text-2xl md:text-3xl font-bold">Mapa del Estacionamiento</h1>
        </div>

        <MapConfig :rows="cfg.rows" :cols="cfg.cols" @update="updateConfig" />

        <ParkingMap
            :cells="cells"
            :rows="cfg.rows"
            :cols="cfg.cols"
            @toggleVip="toggleVip"
            @toggleDisability="toggleDisability"
        />
    </section>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import di from '@/services/di'
import MapConfig from '@/components/map/MapConfig.vue'
import ParkingMap from '@/components/map/ParkingMap.vue'

const cfg = reactive({ rows: 3, cols: 5 })
const cells = ref([])

async function refresh() {
    const cur = await di.mapService.getConfig()
    cfg.rows = cur.rows; cfg.cols = cur.cols
    cells.value = await di.mapService.getGrid()
}

async function updateConfig({ rows, cols }) {
    await di.mapService.saveConfig({ rows, cols, vip: (await di.mapService.getConfig()).vip, disability: (await di.mapService.getConfig()).disability })
    await refresh()
}
async function toggleVip(code) {
    await di.mapService.toggleVip(code)
    await refresh()
}
async function toggleDisability(code) {
    await di.mapService.toggleDisability(code)
    await refresh()
}

onMounted(refresh)
</script>
