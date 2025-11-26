<template>
    <div class="rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200/60 dark:border-slate-700">
        <div class="px-5 py-3 border-b border-slate-200/60 dark:border-slate-700 flex items-center justify-between">
        <div class="flex items-center gap-2">
            <i class="pi pi-map text-xl text-sky-600"></i>
            <h3 class="text-lg font-semibold">Vista General</h3>
        </div>

        <div class="flex flex-wrap gap-3 text-sm">
            <span class="inline-flex items-center gap-2"><span class="w-3 h-3 rounded border border-emerald-500 bg-emerald-100"></span>Disponible</span>
            <span class="inline-flex items-center gap-2"><span class="w-3 h-3 rounded border border-rose-500 bg-rose-100"></span>Ocupado</span>
            <span class="inline-flex items-center gap-2"><span class="w-3 h-3 rounded border border-amber-500 bg-amber-100"></span>VIP</span>
            <span class="inline-flex items-center gap-2"><span class="w-3 h-3 rounded border border-sky-500 bg-sky-100"></span>Discapacidad</span>
        </div>
        </div>

        <div class="p-5">
        <div :style="gridStyle" class="grid gap-5">
            <button
            v-for="cell in cells" :key="cell.code" type="button"
            class="relative aspect-[4/3] rounded-2xl border text-slate-700 dark:text-slate-100
                    flex items-center justify-center text-xl font-medium shadow-sm"
            :class="cellClasses(cell)"
            @click="$emit('toggleVip', cell.code)"
            @contextmenu.prevent="$emit('toggleDisability', cell.code)"
            title="Click: VIP · Secundario: Discapacidad"
            >
            <span v-if="cell.isDisability" class="absolute left-2 top-2 text-sky-600 text-sm">♿</span>
            <span v-if="cell.isVip" class="absolute left-2 top-2 text-amber-500 text-sm">VIP</span>

            {{ cell.code }}
            </button>
        </div>
        <p class="mt-2 text-xs text-slate-400">Sugerencia: clic para alternar VIP, clic derecho para alternar Discapacidad.</p>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    cells: { type: Array, default: () => [] }, 
    rows:  { type: Number, default: 3 },
    cols:  { type: Number, default: 5 },
})
defineEmits(['toggleVip','toggleDisability'])

const gridStyle = {
    gridTemplateColumns: `repeat(${Math.max(1, props.cols)}, minmax(120px, 1fr))`,
}

function cellClasses(cell) {
    if (cell.isOccupied)   return 'border-rose-500 bg-rose-50 dark:bg-rose-900/20'
    if (cell.isVip)        return 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
    if (cell.isDisability) return 'border-sky-500 bg-sky-50 dark:bg-sky-900/20'
    return 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
}
</script>
