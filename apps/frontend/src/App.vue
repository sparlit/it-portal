<script setup lang="ts">
import { onMounted } from 'vue'
import { useThemeStore } from './store/theme'

const themeStore = useThemeStore()

onMounted(() => {
  // Default to IT theme for demo
  themeStore.setTheme('it')
})
</script>

<template>
  <div class="min-h-screen bg-[var(--color-bg-base)]">
    <header class="bg-primary text-white p-6 shadow-lg">
      <div class="container mx-auto flex justify-between items-center">
        <h1 class="text-2xl font-heading">Al Rayes Digital Ecosystem</h1>
        <nav>
          <ul class="flex space-x-6 font-body">
            <li><button @click="themeStore.setTheme('it')" class="hover:underline">IT</button></li>
            <li><button @click="themeStore.setTheme('finance')" class="hover:underline">Finance</button></li>
            <li><button @click="themeStore.setTheme('production')" class="hover:underline">Production</button></li>
          </ul>
        </nav>
      </div>
    </header>

    <main class="container mx-auto py-12 px-6">
      <div class="bg-white p-8 rounded-lg shadow-sm border border-slate-200">
        <h2 class="text-3xl text-primary mb-6">Welcome to the Internal Operations Hub</h2>
        <p class="text-slate-600 font-body leading-relaxed max-w-2xl">
          This is the core infrastructure for Al Rayes Laundry. Use the theme switcher above 
          to see how the portal dynamically adapts its visual identity based on the active department.
        </p>
        
        <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="p-6 border border-slate-100 rounded-md bg-slate-50">
            <h3 class="text-accent font-bold mb-2">Microkernel API</h3>
            <p class="text-sm text-slate-500">FastAPI backend with dynamic plugin loading and RBAC integration.</p>
          </div>
          <div class="p-6 border border-slate-100 rounded-md bg-slate-50">
            <h3 class="text-success font-bold mb-2">PWA Frontend</h3>
            <p class="text-sm text-slate-500">Offline-first Vue.js application with dynamic theming and Pinia.</p>
          </div>
          <div class="p-6 border border-slate-100 rounded-md bg-slate-50">
            <h3 class="text-warning font-bold mb-2">PostgreSQL Queue</h3>
            <p class="text-sm text-slate-500">High-performance background processing using SKIP LOCKED logic.</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style>
.bg-primary {
  background-color: var(--color-primary);
}
.text-primary {
  color: var(--color-primary);
}
.text-accent {
  color: var(--color-accent);
}
.text-success {
  color: var(--color-success);
}
.text-warning {
  color: var(--color-warning);
}
</style>
