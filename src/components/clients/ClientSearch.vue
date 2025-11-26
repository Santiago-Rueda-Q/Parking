<template>
    <div class="flex items-center gap-2">
        <InputText v-model="model" placeholder="Buscar cliente..." />
        <Button icon="pi pi-search" @click="$emit('search', model)" />
    </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'

const props = defineProps({
    modelValue: { type: String, default: '' },
    debounce: { type: Number, default: 300 },
})
const emit = defineEmits(['update:modelValue','search'])

const model = computed({
    get: () => props.modelValue,
    set: v  => emit('update:modelValue', v)
})

let t = null
watch(() => model.value, (v) => {
    clearTimeout(t)
    t = setTimeout(() => emit('search', v), props.debounce)
})
</script>
