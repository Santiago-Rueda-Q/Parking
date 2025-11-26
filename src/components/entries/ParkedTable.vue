<template>
    <div class="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <div class="px-5 py-3 border-b border-slate-200 dark:border-slate-700">
            <h3 class="font-semibold text-lg flex items-center gap-2"><i class="pi pi-list text-sky-600"></i> Vehículos Estacionados</h3>
        </div>
        <div class="p-5 overflow-x-auto">
        <table class="min-w-full text-sm">
            <thead class="text-left text-slate-500">
            <tr>
                <th class="py-2 pr-4">Placa</th>
                <th class="py-2 pr-4">Tipo</th>
                <th class="py-2 pr-4">Ubicación</th>
                <th class="py-2 pr-4">Ingreso</th>
                <th class="py-2 pr-4">Tiempo</th>
                <th class="py-2 pr-4">Cliente</th>
                <th class="py-2"></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="r in rows" :key="r.id" class="border-t border-slate-200/70">
                <td class="py-2 pr-4">{{ r.plate }}</td>
                <td class="py-2 pr-4 capitalize">{{ r.type }}</td>
                <td class="py-2 pr-4">{{ r.slotCode }}</td>
                <td class="py-2 pr-4">{{ fmt(r.startedAtISO) }}</td>
                <td class="py-2 pr-4">{{ elapsed(r.startedAtISO) }}</td>
                <td class="py-2 pr-4">{{ r.client || 'Cliente Ocasional' }}</td>
                <td class="py-2">
                <Button icon="pi pi-sign-out" label="Salida" severity="danger" size="small" @click="$emit('exit', r.plate)" />
                </td>
            </tr>
            <tr v-if="!rows?.length">
                <td colspan="7" class="py-6 text-center text-slate-400">Sin vehículos estacionados</td>
            </tr>
            </tbody>
        </table>
        </div>
    </div>
</template>

<script setup>
import Button from 'primevue/button'
defineProps({ rows: { type:Array, default:()=>[] } })
function fmt(iso){ return new Date(iso).toLocaleString() }
function elapsed(iso){
    const ms = Date.now() - new Date(iso).getTime()
    const m  = Math.floor(ms/60000), h = Math.floor(m/60), mm = m%60
    return `${h}h ${mm}m`
}
</script>
