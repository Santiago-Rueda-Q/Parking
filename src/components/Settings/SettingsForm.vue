<template>
  <div v-if="form" class="space-y-6">
    <!-- Configuración General -->
    <div class="rounded-2xl bg-slate-900/50 border border-slate-700 shadow-sm">
      <div class="px-5 py-4 border-b border-slate-700 flex items-center gap-2">
        <i class="pi pi-cog text-cyan-400"></i>
        <h2 class="text-lg font-semibold text-slate-100">Configuración General</h2>
      </div>
      <div class="p-5 grid lg:grid-cols-2 gap-5">
        <div class="col-span-2">
          <label class="block text-sm mb-1 text-slate-300">Nombre del Negocio</label>
          <InputText v-model="form.appName" class="w-full" placeholder="ParkControl" />
        </div>
        <div class="col-span-2">
          <label class="block text-sm mb-1 text-slate-300">Dirección</label>
          <InputText v-model="form.businessAddress" class="w-full" placeholder="Av. Principal 123" />
        </div>
        <div>
          <label class="block text-sm mb-1 text-slate-300">Teléfono</label>
          <InputText v-model="form.businessPhone" class="w-full" placeholder="555-123-4567" />
        </div>
        <div>
          <label class="block text-sm mb-1 text-slate-300">Símbolo de moneda</label>
          <InputText v-model="form.currencySymbol" class="w-full" placeholder="$" />
        </div>

        <!-- Funciones -->
        <div class="col-span-2 rounded-xl border border-slate-700 p-4 space-y-3">
          <h3 class="font-semibold text-slate-100 mb-2">Funciones</h3>
          <div class="flex items-center gap-3">
            <Checkbox v-model="form.features.enableVip" :binary="true" inputId="vip" />
            <label for="vip" class="text-slate-200">Habilitar clientes VIP</label>
          </div>
          <div class="flex items-center gap-3">
            <Checkbox v-model="form.features.enableDisability" :binary="true" inputId="dis" />
            <label for="dis" class="text-slate-200">Habilitar espacios para discapacidad</label>
          </div>
        </div>

        <!-- Impresión -->
        <div class="col-span-2 rounded-xl border border-slate-700 p-4 space-y-3">
          <h3 class="font-semibold text-slate-100 mb-2">Impresión</h3>
          <div class="flex items-center gap-3">
            <Checkbox v-model="form.printing.enableTickets" :binary="true" inputId="tickets" />
            <label for="tickets" class="text-slate-200">Imprimir tiquetes al ingresar/salir</label>
          </div>
          <div>
            <label class="block text-sm mb-1 text-slate-300">Pie del ticket</label>
            <InputText v-model="form.printing.footerText" class="w-full" placeholder="¡Gracias por su visita!" />
          </div>
        </div>

        <div class="col-span-2 flex items-center gap-3">
          <PButton :disabled="saving" @click="onSave" label="Guardar ajustes" class="p-button-success" />
          <span v-if="savedAt" class="text-xs text-slate-400">Guardado {{ savedAt }}</span>
        </div>
      </div>
    </div>

    <!-- Mantenimiento -->
    <div class="rounded-2xl bg-slate-900/50 border border-slate-700 shadow-sm">
      <div class="px-5 py-4 border-b border-slate-700 flex items-center gap-2">
        <i class="pi pi-database text-amber-300"></i>
        <h2 class="text-lg font-semibold text-slate-100">Mantenimiento del Sistema</h2>
      </div>
      <div class="p-5 space-y-4">
        <div class="rounded-lg bg-amber-500/10 border border-amber-400/40 text-amber-200 px-4 py-3 text-sm">
          ⚠️ Las siguientes acciones pueden ser <b>irreversibles</b>. Procede con precaución.
        </div>
        <div class="grid md:grid-cols-2 gap-4">
          <PButton class="w-full" icon="pi pi-download" label="Exportar todos los datos" @click="onExport" />
          <div>
            <input ref="importInput" type="file" accept="application/json" class="hidden" @change="onImportChange" />
            <PButton class="w-full" icon="pi pi-upload" label="Importar datos" @click="triggerImport" />
          </div>
          <PButton class="w-full p-button-warning" icon="pi pi-trash" label="Limpiar historial" @click="onClearHistory" />
          <PButton class="w-full p-button-danger" icon="pi pi-times" label="Restablecer sistema" @click="onHardReset" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import di from '../../services/di.js'
import { applyTheme } from '../../services/settings.service.js'
import { exportAll, importFromFile, clearHistory, hardReset } from '../../services/backup.service.js'

function getSkeleton() {
  return {
    appName: 'ParkControl',
    language: 'es',
    currencySymbol: '$',
    theme: 'system',
    features: { enableVip: true, enableDisability: true },
    printing: { enableTickets: true, footerText: '¡Gracias por su visita!' },
    businessAddress: '',
    businessPhone: '',
  }
}

const form = ref(getSkeleton())
const saving = ref(false)
const savedAt = ref('')
const importInput = ref()

onMounted(async () => {
  const s = await di.settingsService.load().catch(() => null)
  if (s) form.value = { ...getSkeleton(), ...s }
  applyTheme(form.value.theme)
  di.settingsService.subscribe(s2 => applyTheme(s2.theme))
})

async function onSave() {
  try {
    saving.value = true
    const saved = await di.settingsService.save(form.value)
    savedAt.value = new Date().toLocaleTimeString()
    applyTheme(saved.theme)
  } catch (e) {
    console.error(e)
    alert('No se pudo guardar')
  } finally {
    saving.value = false
  }
}

function onExport() { exportAll() }
function triggerImport() { importInput.value?.click() }
async function onImportChange(e) {
  const file = e?.target?.files?.[0]
  if (!file) return
  try {
    await importFromFile(file)
    alert('Datos importados. Recarga la página para aplicar cambios.')
  } catch {
    alert('Archivo inválido')
  } finally {
    e.target.value = ''
  }
}
function onClearHistory() {
  if (!confirm('¿Seguro que deseas limpiar el historial?')) return
  const removed = clearHistory()
  alert('Elementos removidos: ' + removed.length)
}
function onHardReset() {
  if (!confirm('Esto borrará TODA la data del sistema. ¿Continuar?')) return
  const removed = hardReset()
  alert('Sistema restablecido. Claves borradas: ' + removed.length + '\nRecarga la página.')
}
</script>

