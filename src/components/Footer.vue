<template>
  <footer class="bg-black/95 border-t border-white/10 mt-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

        <!-- Brand Section -->
        <router-link to="/" class="group flex items-center gap-3">
          <div class="relative flex items-center justify-center w-10 h-10 rounded-xl bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)] group-hover:shadow-[0_0_25px_rgba(220,38,38,0.7)] transition-all duration-300">
            <Film class="w-5 h-5 fill-current" />
          </div>
          <div class="flex flex-col">
            <span class="text-2xl font-black tracking-widest text-white leading-none uppercase drop-shadow-md font-sans">KWABOX</span>
            <span class="text-[0.6rem] text-zinc-400 font-medium tracking-[0.2em] uppercase group-hover:text-red-500 transition-colors">Unlimited Movies</span>
          </div>
        </router-link>

        <!-- Quick Links -->
        <div>
          <h3 class="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
          <ul class="space-y-2">
            <li v-for="link in navLinks" :key="link.path">
              <router-link 
                :to="link.path" 
                class="text-gray-400 hover:text-white transition-colors text-sm"
              >
                {{ link.name }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Categories -->
        <div>
          <h3 class="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Categories</h3>
          <ul class="space-y-2">
            <li v-for="category in categories" :key="category">
              <router-link 
                :to="`/category/${category.toLowerCase()}`" 
                class="text-gray-400 hover:text-white transition-colors text-sm"
              >
                {{ category }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Social Links -->
        <div>
          <h3 class="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Connect</h3>
          <div class="flex gap-4">
            <a 
              v-for="social in socialLinks" 
              :key="social.name"
              :href="social.url"
              target="_blank"
              rel="noopener noreferrer"
              class="text-gray-400 hover:text-red-600 transition-colors"
              :aria-label="social.name"
            >
              <component :is="social.icon" class="w-5 h-5" />
            </a>
          </div>
        </div>

      </div>

      <!-- Bottom Bar -->
      <div class="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <p class="text-gray-400 text-sm">
          © {{ currentYear }} KWABOX. All rights reserved.
        </p>
        <div class="flex gap-6 flex-wrap justify-center md:justify-start">
          <router-link to="/privacy-policy" class="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</router-link>
          <router-link to="/terms-of-service" class="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</router-link>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { Film, Facebook, Twitter, Instagram, Youtube } from 'lucide-vue-next'

const currentYear = computed(() => new Date().getFullYear())

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Movies', path: '/movies' },
 
  { name: 'Favorites', path: '/favorites' }
]

const categories = [
  'Action',
  'Comedy',
  'Drama',
  
]

const socialLinks = [
  { name: 'Facebook', icon: Facebook, url: 'https://www.facebook.com' },
  { name: 'Twitter', icon: Twitter, url: 'https://www.twitter.com' },
  { name: 'Instagram', icon: Instagram, url: 'https://www.instagram.com' },
  { name: 'Youtube', icon: Youtube, url: 'https://www.youtube.com' }
]
</script>
