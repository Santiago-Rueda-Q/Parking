<template>
    <div class="min-h-screen w-screen bg-slate-900 text-slate-100 flex">

        <aside class="hidden md:flex w-64 bg-[#203342] border-r border-slate-800">
        <SidebarNav :items="items" />
        </aside>

        <transition name="slide">
        <aside
            v-if="open"
            class="fixed inset-y-0 left-0 z-40 w-72 bg-[#203342] border-r border-slate-800 md:hidden"
        >
            <SidebarNav :items="items" />
        </aside>
        </transition>
        <div
        v-if="open"
        class="fixed inset-0 z-30 bg-black/40 md:hidden"
        @click="open=false"
        />

        <section class="flex-1 min-w-0 flex flex-col">
        <header class="md:hidden flex items-center gap-3 px-4 h-14 border-b border-slate-800">
            <button class="p-2 rounded-lg hover:bg-slate-800" @click="open=true" aria-label="Abrir menú">
            <i class="pi pi-bars text-lg"></i>
            </button>
            <span class="font-semibold">{{ appName }}</span>
        </header>

        <main class="flex-1 min-h-0 p-6">
            <RouterView />
        </main>
        </section>
    </div>
</template>

<script setup>
import SidebarNav from '@/components/SidebarNav.vue'
import { getNavItems } from '@/services/navigation.service'
import { ref } from 'vue'

const items = getNavItems()
const open = ref(false) 
</script>

<style scoped>
.slide-enter-from, .slide-leave-to { transform: translateX(-100%); }
.slide-enter-active, .slide-leave-active { transition: transform .2s ease; }
</style>
