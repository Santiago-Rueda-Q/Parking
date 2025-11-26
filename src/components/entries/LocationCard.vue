<template>
    <div class="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <div class="px-5 py-3 border-b border-slate-200 dark:border-slate-700">
            <h3 class="font-semibold text-lg flex items-center gap-2"><i class="pi pi-map-marker text-sky-600"></i> Ubicación</h3>
        </div>

        <div class="p-5 space-y-4">
        <div>
            <label class="block text-sm mb-1">Espacio de estacionamiento:</label>
            <Dropdown
                v-model="selected"
                :options="slotOptions"
                optionLabel="label"
                optionValue="value"
                :filter="true"
                filterPlaceholder="Buscar espacio..."
                class="w-full"
                placeholder="Seleccionar espacio"
            >
            <template #value="{ value, placeholder }">
                <span v-if="!value">{{ placeholder }}</span>
                <span v-else>{{ slotOptions.find(o => o.value===value)?.label || value }}</span>
            </template>
            </Dropdown>
        </div>

        <div class="grid grid-cols-4 sm:grid-cols-6 gap-3">
            <button v-for="opt in quick" :key="opt.value" type="button"
            class="px-3 py-1.5 rounded-lg border text-sm transition"
            :class="selected===opt.value
                ? 'border-emerald-600 bg-emerald-200 text-emerald-800'
                : 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'"
            @click="selected = opt.value">
            {{ opt.label }}
            </button>
        </div>
        <Button
            class="w-full"
            icon="pi pi-check-circle"
            label="Registrar Ingreso"
            @click="onSubmit"
        />  
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'

const props = defineProps({
    modelValue: { type:String, default:'' },  
    grid: { type:Array, default:()=>[] }       
})
const emit = defineEmits(['update:modelValue','submit'])

function onSubmit(){
    if(!selected.value){
        alert('Seleccione un espacio disponible.');
        return;
    }
    emit('submit');
}

const selected = computed({
    get: () => props.modelValue,
    set: v  => emit('update:modelValue', v)
})

const slotOptions = computed(() =>
    props.grid.filter(c => !c.isOccupied).map(c => ({ label: c.code, value: c.code }))
)
const quick = computed(() => slotOptions.value.slice(0, 12))
</script>
