<template>
    <div class="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 shadow-sm">
        <div class="px-5 py-3 border-b border-slate-200/60 dark:border-slate-700 flex items-center gap-2">
            <i class="pi pi-file text-xl text-sky-600"></i>
            <h3 class="text-lg font-semibold">Factura</h3>
        </div>

        <div class="p-5 space-y-4" v-if="invoice">
        <div>
            <h4 class="font-semibold text-lg">{{ props.settings?.appName || 'ParkControl' }}</h4>
            <p class="text-sm text-slate-500">
                {{ props.settings?.businessAddress || '' }}<br/>
                Tel: {{ props.settings?.businessPhone || '' }}
            </p>
            <p class="mt-2 font-semibold">COMPROBANTE DE PAGO</p>
            <p class="text-sm">Fecha: {{ now }}</p>
        </div>

        <div class="grid grid-cols-2 gap-y-2 max-w-md">
            <div class="font-semibold">Placa:</div><div>{{ invoice.entry.plate }}</div>
            <div class="font-semibold">Tipo:</div><div>{{ invoice.entry.type.toUpperCase() }}</div>
            <div class="font-semibold">Espacio:</div><div>{{ invoice.entry.slotCode }}</div>
            <div class="font-semibold">Cliente:</div><div>{{ invoice.entry.client || 'Cliente Ocasional' }}</div>
            <div class="font-semibold">Ingreso:</div><div>{{ fmt(invoice.entry.startedAtISO) }}</div>
            <div class="font-semibold">Salida:</div><div>{{ fmt(invoice.endedAtISO) }}</div>
            <div class="font-semibold">Tiempo:</div><div>{{ invoice.hours }}h</div>
        </div>

        <hr class="my-3"/>

        <div class="grid grid-cols-2 gap-y-2 max-w-md items-center">
            <div>Tarifa por hora:</div><div class="text-right">{{ money(invoice.ratePerHour) }}</div>
            <div>Horas facturadas:</div><div class="text-right">{{ invoice.hours }}</div>
            <div class="font-bold text-lg">TOTAL A PAGAR:</div>
            <div class="text-right font-extrabold text-lg">{{ money(invoice.total) }}</div>
        </div>

        <div class="pt-6 flex items-center justify-end gap-3">
            <Button icon="pi pi-check-circle" label="Procesar Salida" severity="success" @click="$emit('process')" />
            <Button icon="pi pi-print" label="Imprimir" outlined @click="() => window.print()" />
        </div>
        </div>

        <div v-else class="p-5 text-slate-500">
        Busque una placa para generar la factura.
        </div>
    </div>
</template>

<script setup>
import Button from 'primevue/button'
const props = defineProps({ invoice: Object, settings: Object })
const now = new Date().toLocaleString()
function fmt(iso){ return new Date(iso).toLocaleString() }
function money(n){
    const sym = props.settings?.currencySymbol ?? '$'
    return `${sym}${Number(n||0).toLocaleString(undefined,{minimumFractionDigits:2})}`
}
</script>
