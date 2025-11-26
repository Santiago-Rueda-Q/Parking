
<template>
  <section class="space-y-6">
    <div class="flex items-center gap-3">
      <i class="pi pi-cog text-xl text-cyan-400"></i>
      <h1 class="text-2xl md:text-3xl font-bold text-slate-100">Ajustes</h1>
    </div>
    <SettingsForm />
  </section>
</template>

<script setup>
import SettingsForm from '../../components/Settings/SettingsForm.vue'
</script>
