<template>
    <div class="rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200/60 dark:border-slate-700 p-5">
        <div class="flex items-center gap-3 mb-3">
        <i :class="category.icon" class="text-3xl text-blue-600"></i>
        <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-100">{{ category.label }}</h3>
        </div>

        <label class="block text-sm text-slate-600 dark:text-slate-300 mb-2">Cantidad de espacios:</label>
        <InputNumber
            v-model="model"
            :min="0"
            :step="1"
            showButtons
            class="w-full"
            inputClass="w-full"
        />
    </div>
</template>

<script setup>
import { computed } from 'vue'
import InputNumber from 'primevue/inputnumber'

const props = defineProps({
    category: { type: Object, required: true },
    modelValue: { type: Number, default: 0 },
})
const emit = defineEmits(['update:modelValue'])

const model = computed({
    get: () => props.modelValue,
    set: v  => emit('update:modelValue', v)
})
</script>
