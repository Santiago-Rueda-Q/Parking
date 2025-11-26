<template>
    <div class="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 shadow-sm">
        <div class="px-5 py-3 border-b border-slate-200/60 dark:border-slate-700 flex items-center gap-2">
            <i class="pi pi-sign-out text-xl text-sky-600"></i>
            <h3 class="text-lg font-semibold">Buscar Vehículo</h3>
        </div>

        <div class="p-5 space-y-3">
        <div class="flex items-center gap-2">
            <i class="pi pi-search text-sky-600"></i>
            <label>Buscar por placa:</label>
        </div>
        <div class="flex">
            <InputText v-model="model" class="w-full" placeholder="ABC123" @keyup.enter="$emit('enter')" />
            <Button icon="pi pi-search" class="ml-2" @click="$emit('enter')" />
        </div>

        <div v-if="found" class="border-l-4 border-sky-500 bg-sky-50 text-sky-900 dark:bg-sky-900/20 p-3 rounded">
            <i class="pi pi-car mr-2"></i>
            <b>Vehículo encontrado:</b>
            <span class="ml-1">{{ found.plate }} ({{ (found.type || '').toUpperCase() }})</span>
            <span class="ml-3">Espacio: <b>{{ found.slotCode }}</b></span>
            <span class="ml-3">Ingreso: {{ formatDate(found.startedAtISO) }}</span>
        </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
const props = defineProps({ modelValue: String, found: Object })
const emit = defineEmits(['update:modelValue','enter'])
const model = computed({
    get: () => props.modelValue,
    set: v  => emit('update:modelValue', v?.toUpperCase() || '')
})
function formatDate(iso) { return new Date(iso).toLocaleString() }
</script>
