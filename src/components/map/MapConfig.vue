<template>
    <div class="rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200/60 dark:border-slate-700">
        <div class="px-5 py-3 border-b border-slate-200/60 dark:border-slate-700 flex items-center gap-2">
            <i class="pi pi-sliders-h text-xl text-sky-600"></i>
            <h3 class="text-lg font-semibold">Configuración del Mapa</h3>
        </div>

        <div class="p-5 flex flex-wrap items-end gap-5">
        <div>
            <label class="block text-sm mb-1"><i class="pi pi-arrows-v mr-2"></i>Filas:</label>
            <InputNumber v-model="local.rows" :min="1" :step="1" inputClass="w-28" />
        </div>
        <div>
            <label class="block text-sm mb-1"><i class="pi pi-arrows-h mr-2"></i>Columnas:</label>
            <InputNumber v-model="local.cols" :min="1" :step="1" inputClass="w-28" />
        </div>

        <Button icon="pi pi-refresh" label="Actualizar mapa" @click="save" />
        </div>
    </div>
</template>

<script setup>
import { reactive } from 'vue'
import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'

const props = defineProps({ rows: Number, cols: Number })
const emit = defineEmits(['update'])

const local = reactive({ rows: props.rows ?? 3, cols: props.cols ?? 5 })
function save() { emit('update', { rows: local.rows|0, cols: local.cols|0 }) }
</script>
