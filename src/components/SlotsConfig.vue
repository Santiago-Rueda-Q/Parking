<template>
    <section class="space-y-5">
        <div class="flex items-center gap-3">
            <i class="pi pi-table text-xl text-blue-600"></i>
            <h1 class="text-2xl md:text-3xl font-bold">Gestión de Cupos</h1>
        </div>

        <div class="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 shadow-sm">
        <div class="px-5 py-4 border-b border-slate-200/60 dark:border-slate-700">
            <h2 class="text-lg font-semibold">Configuración de Cupos</h2>
        </div>

        <div class="p-5">
            <div class="grid gap-4 md:gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <SlotCard
                v-for="c in form"
                :key="c.key"
                :category="{ icon: c.icon, label: c.label }"
                v-model="c.value"
            />
            </div>

            <div class="mt-6">
            <Button
                :loading="saving"
                label="Guardar Configuración"
                icon="pi pi-save"
                @click="onSave"
            />
            </div>
        </div>
        </div>
    </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import Button from 'primevue/button'
import SlotCard from '@/components/SlotCard.vue'
import di from '@/services/di'

const form = ref([])
const saving = ref(false)

onMounted(async () => {
  form.value = await di.slotsService.getCategoriesWithValues()
})

async function onSave() {
  try {
    saving.value = true
    await di.slotsService.saveConfig(form.value)   
    form.value = await di.slotsService.getCategoriesWithValues() 
    alert('Configuración guardada.')
  } finally {
    saving.value = false
  }
}
</script>
