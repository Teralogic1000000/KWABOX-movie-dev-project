<template>
  <nav class="fixed w-full z-50 transition-all duration-300 border-b border-white/10 bg-zinc-950/80 backdrop-blur-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-20">
        
        <!-- Logo -->
        <router-link to="/" class="group flex items-center gap-3">
          <div class="relative flex items-center justify-center w-10 h-10 rounded-xl bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)] group-hover:shadow-[0_0_25px_rgba(220,38,38,0.7)] transition-all duration-300">
            <Film class="w-5 h-5 fill-current" />
          </div>
          <div class="flex flex-col">
            <span class="text-2xl font-black tracking-widest text-white leading-none uppercase drop-shadow-md font-sans">KWABOX</span>
            <span class="text-[0.6rem] text-zinc-400 font-medium tracking-[0.2em] uppercase group-hover:text-red-500 transition-colors">Unlimited Movies</span>
          </div>
        </router-link>

        <!-- Desktop Nav -->
        <div class="hidden md:flex items-center gap-8">
          <div class="flex items-center gap-1">
            <router-link 
              v-for="link in navLinks" 
              :key="link.path"
              :to="link.path"
              class="px-4 py-2 text-sm font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-wide rounded-lg"
              active-class="text-white bg-white/10"
            >
              {{ link.name }}
            </router-link>
          </div>

          <!-- Search -->
          <div class="relative group">
             <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
               <Search class="h-4 w-4 text-zinc-500 group-focus-within:text-red-500 transition-colors" />
             </div>
             <input 
               type="text" 
               v-model="searchQuery"
               @input="onSearchInput"
               class="block w-48 focus:w-72 sm:w-48 sm:focus:w-72 pl-10 pr-4 py-2 bg-black/50 border border-zinc-800 rounded-full text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all duration-300 ease-in-out"
               placeholder="Filter movies..." 
             />
          </div>

          <!-- Auth Buttons -->
          <div class="flex items-center gap-3">
            <button class="text-sm font-bold text-zinc-400 hover:text-white uppercase">Sign In</button>
            <button class="px-5 py-2 text-sm font-bold bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-md uppercase">Sign Up</button>
          </div>
        </div>

        <!-- Mobile Toggle -->
        <button @click="isMenuOpen = !isMenuOpen" class="md:hidden text-zinc-300">
          <Menu v-if="!isMenuOpen" class="w-7 h-7" />
          <X v-else class="w-7 h-7" />
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <transition name="slide-fade">
      <div v-if="isMenuOpen" class="md:hidden bg-zinc-900/95 backdrop-blur-md border-t border-white/10">
        <div class="flex flex-col px-4 py-4 gap-4">
          <router-link 
            v-for="link in navLinks" 
            :key="link.path"
            :to="link.path"
            @click="isMenuOpen = false"
            class="px-4 py-2 text-sm font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-wide rounded-lg"
            active-class="text-white bg-white/10"
          >
            {{ link.name }}
          </router-link>

          <!-- Mobile Search -->
          <div class="relative group mt-2">
             <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
               <Search class="h-4 w-4 text-zinc-500 group-focus-within:text-red-500 transition-colors" />
             </div>
             <input 
               type="text" 
               v-model="searchQuery"
               @input="onSearchInput"
               class="block w-full pl-10 pr-4 py-2 bg-black/50 border border-zinc-800 rounded-full text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all duration-300 ease-in-out"
               placeholder="Filter movies..." 
             />
          </div>

          <!-- Auth Buttons Mobile -->
          <div class="flex flex-col gap-2 mt-2">
            <button class="text-sm font-bold text-zinc-400 hover:text-white uppercase">Sign In</button>
            <button class="px-5 py-2 text-sm font-bold bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-md uppercase">Sign Up</button>
          </div>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Film, Menu, X, Search } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const isMenuOpen = ref(false)
const searchQuery = ref(route.query.q || '')

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Movies', path: '/movies' },
  { name: 'My List', path: '/favorites' }
]

let debounceTimeout = null
const onSearchInput = () => {
  if (debounceTimeout) clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    const query = searchQuery.value ? { q: searchQuery.value } : {}
    router.push({ path: '/movies', query })
  }, 500)
}
</script>

<style scoped>
/* Slide fade for mobile menu */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}
.slide-fade-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
