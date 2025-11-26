<template>
    <RouterLink
        :to="item.path"
        class="flex items-center gap-3 px-3 py-2 rounded-xl transition-colors"
        :class="isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white hover:bg-slate-700'"
    >
        <i :class="item.icon" class="text-base"></i>
        <span class="text-sm font-medium">{{ item.labelEs }}</span>
    </RouterLink>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const props = defineProps({ item: { type: Object, required: true } })
const route = useRoute()
const isActive = computed(() => route.path.startsWith(props.item.path))
</script>
