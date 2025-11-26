<template>
    <div class="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <div class="px-5 py-3 border-b border-slate-200 dark:border-slate-700">
            <h3 class="font-semibold text-lg flex items-center gap-2"><i class="pi pi-car text-sky-600"></i> Datos del Vehículo</h3>
        </div>

        <div class="p-5 space-y-4">
        <div>
            <label class="block text-sm mb-1">Placa:</label>
            <InputText v-model="local.plate" class="w-full" placeholder="AAA-123" @input="maskPlate" @blur="maskPlate"/>
            <small v-if="plateError" class="text-rose-500">{{ plateError }}</small>
        </div>

        <div>
            <label class="block text-sm mb-1">Tipo de Vehículo:</label>
            <Dropdown v-model="local.type" :options="typeOptions" optionLabel="label" optionValue="value" class="w-full" />
        </div>

        <div class="flex flex-col gap-3">
            <div class="flex items-center gap-2">
                <Checkbox v-model="local.vip" :binary="true" inputId="vip" />
                <label for="vip">Cliente VIP</label>
            </div>
            <div class="flex items-center gap-2">
                <Checkbox v-model="local.disability" :binary="true" inputId="dis" />
                <label for="dis">Espacio para discapacidad</label>
            </div>
        </div>

        <div>
            <label class="block text-sm mb-1">Cliente:</label>
            <Dropdown
                v-model="local.clientId"
                :options="clientOptions"
                optionLabel="name"
                optionValue="id"
                :filter="true"
                filterPlaceholder="Buscar cliente..."
                showClear
                placeholder="Seleccionar cliente (opcional)"
                class="w-full"
            />
        </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, watch, computed } from 'vue'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Checkbox  from 'primevue/checkbox'

const props = defineProps({
    modelValue: { type: Object, default: () => ({}) },
    clientOptions: { type: Array, default: () => [] }  
})
const emit = defineEmits(['update:modelValue'])

const local = reactive({
    plate: '', type: 'car', vip: false, disability: false, clientId: null,
    ...props.modelValue
})
watch(local, v => emit('update:modelValue', { ...v }), { deep:true })

const typeOptions = [
    { label: 'Carro',       value: 'car' },
    { label: 'Moto',        value: 'motorcycle' },
    { label: 'Bicicleta',   value: 'bicycle' },
]

function maskPlate() {
    let s = (local.plate || '')
        .toUpperCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[‐-‒–—−]/g, '-')    
        .replace(/[^A-Z0-9-]/g,'');   

    s = s.replace(/-/g,'');         
    const L = s.slice(0,3).replace(/[^A-Z]/g,'');
    const D = s.slice(3,6).replace(/[^0-9]/g,'');
    local.plate = L + (L.length===3?'-':'') + D;
}

const plateError = computed(() => {
    if (!local.plate) return null
    return /^[A-Z]{3}-\d{3}$/.test(local.plate) ? null : 'Formato esperado: AAA-123 (falta separación o caracteres inválidos).'
})
</script>
