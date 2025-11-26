<template>
  <nav class="flex flex-col h-full">
    <!-- Header con nombre dinámico -->
    <div class="flex items-center gap-2 px-4 py-5">
      <div class="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-primary-600 text-white font-bold">
        {{ initial }}
      </div>
      <div class="text-lg font-semibold text-white">{{ appName }}</div>
    </div>

    <!-- Lista de navegación -->
    <ul class="flex-1 px-2 space-y-1">
      <li v-for="item in (items || [])" :key="item.nameEn">
        <NavItem :item="item" />
      </li>
    </ul>

    <!-- Footer -->
    <div class="px-4 py-4 text-center text-xs text-gray-400 border-t border-gray-700">
      Sistema v2.1.0
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import NavItem from './NavItem.vue'
import di from '@/services/di'

// Props desde el layout (NO tocar)
defineProps({
  items: { type: Array, required: true },
})

// Nombre del negocio
const appName = ref('ParkControl')
const initial = computed(() => (appName.value?.[0] || 'P').toUpperCase())

let unSub = null
onMounted(async () => {
  try {
    const s = await di.settingsService.load()
    appName.value = s?.appName || 'ParkControl'
  } catch {}
  unSub = di.settingsService.subscribe(s => {
    if (s?.appName) appName.value = s.appName
  })
})
onBeforeUnmount(() => { if (unSub) unSub() })
</script>

<style scoped></style>
