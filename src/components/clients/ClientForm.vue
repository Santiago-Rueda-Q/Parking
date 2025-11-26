<template>
    <div class="rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200/60 dark:border-slate-700">
        <div class="px-5 py-3 border-b border-slate-200/60 dark:border-slate-700 flex items-center gap-2">
            <i class="pi pi-users text-xl text-sky-600"></i>
            <h3 class="text-lg font-semibold">Nuevo Cliente</h3>
        </div>

        <div class="p-5">
            <div class="max-w-xl mx-auto min-h-[420px] flex flex-col justify-center space-y-4">
                <div>
                    <label class="block text-sm mb-1"><i class="pi pi-user mr-2" />Nombre completo:</label>
                    <InputText v-model="local.name" class="w-full" placeholder="Nombre del cliente" />
                </div>

                <div>
                    <label class="block text-sm mb-1"><i class="pi pi-phone mr-2" />Teléfono:</label>
                    <InputText
                        v-model="local.phone"
                        class="w-full"
                        inputmode="numeric" pattern="[0-9]*"
                        placeholder="Teléfono"
                        @input="local.phone = (local.phone || '').replace(/\\D+/g, '').slice(0, 15)"
                    />
                </div>

                <div>
                    <label class="block text-sm mb-1"><i class="pi pi-envelope mr-2" />Email:</label>
                    <InputText v-model="local.email" class="w-full" placeholder="Email" />
                </div>

                <div class="flex items-center gap-2">
                    <Checkbox v-model="local.vip" :binary="true" inputId="vip" />
                    <label for="vip">Cliente VIP</label>
                </div>

                <Button class="w-full" icon="pi pi-user-plus" label="Agregar Cliente" @click="submit" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive } from 'vue'
import InputText from 'primevue/inputtext'
import Checkbox from 'primevue/checkbox'
import Button from 'primevue/button'

const emit = defineEmits(['create'])
const local = reactive({ name: '', phone: '', email: '', vip: false })

function submit() {
    emit('create', { ...local })
}

function reset() {
    local.name = ''
    local.phone = ''
    local.email = ''
    local.vip = false
}
defineExpose({ reset })
</script>
