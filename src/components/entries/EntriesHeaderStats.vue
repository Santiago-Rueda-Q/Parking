<template>
    <div class="flex items-center gap-3">
        <div
            v-for="s in items"
            :key="s.key"
            class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                    ring-1 shadow-sm select-none"
            :class="variant(s.key)"
            title="Usados / Totales"
        >
        <font-awesome-icon :icon="categoryIcons[s.key]" class="text-base opacity-90" aria-hidden="true" />
        <span class="text-[13px] font-medium tabular-nums">
            {{ s.used }}/{{ s.total }}
        </span>
        </div>
    </div>
    </template>

    <script setup>
    import { faCar, faMotorcycle, faBicycle, faCrown, faWheelchair } from '@fortawesome/free-solid-svg-icons'

    const props = defineProps({
    items: { type: Array, default: () => [] } 
    })

    const categoryIcons = {
        car: faCar,
        motorcycle: faMotorcycle,
        bicycle: faBicycle,
        vip: faCrown,
        disability: faWheelchair,
    }

    function variant(key) {
    const base = 'bg-slate-900/70 text-slate-100 ring-slate-700 ' +
                'shadow-black/10 backdrop-blur-sm'
    switch (key) {
        case 'car':        return base + ' ring-sky-500'
        case 'motorcycle': return base + ' ring-indigo-500'
        case 'bicycle':    return base + ' ring-emerald-500'
        case 'vip':        return base + ' ring-amber-500'
        case 'disability': return base + ' ring-cyan-500'
        default:           return base
    }
}
</script>
