<template>
  <div class="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
    <div class="px-5 py-3 border-b border-slate-200 dark:border-slate-700">
      <h3 class="font-semibold text-lg flex items-center gap-2">
        <i class="pi pi-car text-sky-600"></i> Datos del Vehículo
      </h3>
    </div>

    <div class="p-5 space-y-4">
      <!-- PLACA EN 6 CASILLAS -->
      <div>
        <label class="block text-sm mb-1">Placa:</label>

        <div class="inline-flex items-center gap-3">
          <!-- 3 letras -->
          <div class="flex gap-2">
            <input
              v-for="idx in 3"
              :key="'L' + idx"
              :ref="el => setPlateInputRef(el, idx - 1)"
              v-model="plateChars[idx - 1]"
              class="w-12 h-12 text-center uppercase border rounded-lg text-lg
                     bg-white dark:bg-slate-900
                     border-slate-300 dark:border-slate-600
                     text-slate-700 dark:text-slate-100
                     focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              maxlength="1"
              inputmode="text"
              @input="onCharInput(idx - 1, $event, 'letter')"
              @keydown.backspace="onBackspace(idx - 1, $event)"
            />
          </div>

          <span class="text-lg font-semibold">-</span>

          <!-- 3 dígitos -->
          <div class="flex gap-2">
            <input
              v-for="idx in 3"
              :key="'D' + idx"
              :ref="el => setPlateInputRef(el, idx + 2)"
              v-model="plateChars[idx + 2]"
              class="w-12 h-12 text-center border rounded-lg text-lg
                     bg-white dark:bg-slate-900
                     border-slate-300 dark:border-slate-600
                     text-slate-700 dark:text-slate-100
                     focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              maxlength="1"
              inputmode="numeric"
              @input="onCharInput(idx + 2, $event, 'digit')"
              @keydown.backspace="onBackspace(idx + 2, $event)"
            />
          </div>
        </div>

        <small v-if="plateError" class="text-rose-500 block mt-1">
          {{ plateError }}
        </small>
      </div>

      <!-- TIPO DE VEHÍCULO -->
      <div>
        <label class="block text-sm mb-1">Tipo de Vehículo:</label>
        <Dropdown
          v-model="type"
          :options="typeOptions"
          optionLabel="label"
          optionValue="value"
          class="w-full"
        />
      </div>

      <!-- FLAGS -->
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2">
          <Checkbox v-model="vip" :binary="true" inputId="vip" />
          <label for="vip" class="text-sm">Cliente VIP</label>
        </div>
        <div class="flex items-center gap-2">
          <Checkbox v-model="disability" :binary="true" inputId="disability" />
          <label for="disability" class="text-sm">Persona con discapacidad</label>
        </div>
      </div>

      <!-- CLIENTE -->
      <div>
        <label class="block text-sm mb-1">Cliente (opcional):</label>
        <Dropdown
          v-model="clientId"
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
import { computed, ref, watch, onMounted, nextTick } from 'vue'
import Dropdown from 'primevue/dropdown'
import Checkbox from 'primevue/checkbox'

const props = defineProps({
  modelValue: { type: Object, default: () => ({}) },
  clientOptions: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:modelValue'])

function updateField(field, value) {
  emit('update:modelValue', {
    plate: '',
    type: 'car',
    vip: false,
    disability: false,
    clientId: null,
    ...(props.modelValue || {}),
    [field]: value,
  })
}

/* ==================== PLACA: 6 CASILLAS ==================== */
/**
 * Índices:
 *  0,1,2 -> letras
 *  3,4,5 -> dígitos
 */
const plateChars = ref(['', '', '', '', '', ''])
const plateInputs = ref(Array(6).fill(null))

function setPlateInputRef(el, index) {
  if (!el) return
  plateInputs.value[index] = el
}

/** Sincroniza casillas desde form.plate (modelo padre) */
function syncPlateFromModel(plateStr) {
  const raw = String(plateStr ?? '').toUpperCase()
  const compact = raw.replace(/[^A-Z0-9]/g, '').slice(0, 6)

  const chars = ['', '', '', '', '', '']
  for (let i = 0; i < compact.length && i < 6; i++) {
    chars[i] = compact[i]
  }
  plateChars.value = chars
}

/** Arma AAA-123 y lo manda al padre */
function syncModelFromPlateChars() {
  const [l1, l2, l3, d1, d2, d3] = plateChars.value
  const letters = `${l1}${l2}${l3}`.toUpperCase()
  const digits = `${d1}${d2}${d3}`

  let combined = ''
  if (letters.trim() || digits.trim()) {
    combined = `${letters}-${digits}`
  }

  updateField('plate', combined)
}

watch(
  () => props.modelValue.plate,
  val => {
    syncPlateFromModel(val)
  },
  { immediate: true }
)

watch(
  plateChars,
  () => {
    syncModelFromPlateChars()
  },
  { deep: true }
)

/* ---------- Navegación entre casillas ---------- */

function focusInput(index) {
  nextTick(() => {
    const el = plateInputs.value[index]
    if (el) {
      el.focus()
      el.select()
    }
  })
}

function onCharInput(index, event, kind) {
  let v = String(event.target.value || '').toUpperCase()

  if (kind === 'letter') {
    v = v.replace(/[^A-Z]/g, '')
  } else {
    v = v.replace(/[^0-9]/g, '')
  }

  if (v.length > 1) v = v.charAt(0)

  plateChars.value[index] = v

  // 👉 si se digitó algo y no es la última casilla, pasamos a la siguiente
  if (v && index < plateChars.value.length - 1) {
    focusInput(index + 1)
  }
}

function onBackspace(index, event) {
  const current = plateChars.value[index]

  if (current) {
    // borrar el carácter actual
    plateChars.value[index] = ''
    return
  }

  if (!current && index > 0) {
    event.preventDefault()
    plateChars.value[index - 1] = ''
    focusInput(index - 1)
  }
}

/* ---------- Validación mínima ---------- */

const plateError = computed(() => {
  const [l1, l2, l3, d1, d2, d3] = plateChars.value
  const letters = `${l1}${l2}${l3}`.trim()
  const digits  = `${d1}${d2}${d3}`.trim()

  if (!letters && !digits) return null
  if (letters.length !== 3 || digits.length !== 3) {
    return 'Completa la placa: 3 letras y 3 dígitos.'
  }
  return null
})

/* ==================== RESTO DE CAMPOS ==================== */

const type = computed({
  get: () => props.modelValue.type ?? 'car',
  set: v => updateField('type', v),
})

const vip = computed({
  get: () => !!props.modelValue.vip,
  set: v => updateField('vip', v),
})

const disability = computed({
  get: () => !!props.modelValue.disability,
  set: v => updateField('disability', v),
})

const clientId = computed({
  get: () => props.modelValue.clientId ?? null,
  set: v => updateField('clientId', v),
})

const typeOptions = [
  { label: 'Carro',      value: 'car' },
  { label: 'Moto',       value: 'motorcycle' },
  { label: 'Bicicleta',  value: 'bicycle' },
]

onMounted(() => {
  const anyChar = plateChars.value.some(c => !!c)
  if (!anyChar) {
    focusInput(0)
  }
})
</script>
