<template>
  <div class="min-h-screen bg-black text-white pt-24 pb-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 class="text-5xl font-black text-white tracking-tight flex items-center gap-3">
            <span class="text-yellow-500">MY</span> LIST
          </h1>
          <p class="text-zinc-400 mt-2 font-medium tracking-wide">
            {{ favorites.length }} Titles Saved
          </p>
        </div>
        
        <button
          v-if="favorites.length > 0"
          @click="clearAll"
          class="px-6 py-2 bg-zinc-900 border border-zinc-800 text-red-500 font-bold rounded-full hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-300 uppercase tracking-widest text-xs shadow-lg"
        >
          Clear All Items
        </button>
      </div>

      <div v-if="favorites.length === 0" class="flex flex-col items-center justify-center py-32 text-center animate-fade-in">
        <div class="relative mb-8 group">
          <div class="absolute inset-0 bg-red-600 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
          <div class="relative p-8 bg-zinc-900 rounded-full border border-white/5">
            <Heart class="w-16 h-16 text-zinc-600 group-hover:text-red-500 transition-colors duration-500" />
          </div>
        </div>
        <h2 class="text-3xl font-black mb-3 text-white">Your list is empty</h2>
        <p class="text-zinc-500 mb-8 text-lg max-w-md">Movies and TV shows you add to your list will appear here.</p>
        <router-link
          to="/movies"
          class="px-10 py-4 bg-white text-black font-black rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)] uppercase tracking-wide"
        >
          Browse Movies
        </router-link>
      </div>

      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        <div
          v-for="item in favorites"
          :key="item.id"
          class="group relative aspect-[2/3] rounded-xl overflow-hidden bg-zinc-900 cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-yellow-500/10 transition-all duration-500 lg:hover:-translate-y-2"
        >
          <img
            :src="getImageUrl(item.poster_path, 'poster', 'medium')"
            :alt="item.title || item.name"
            class="w-full h-full object-cover transition-transform duration-700 lg:group-hover:scale-110"
          />

          <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300 flex flex-col p-3 md:p-4">
            
            <button
              @click.stop="removeFromFavorites(item.id)"
              class="self-end p-2 bg-black/60 backdrop-blur-md rounded-full text-zinc-400 hover:bg-red-600 hover:text-white transition-all hover:scale-110 border border-white/10"
              title="Remove from list"
            >
              <Trash2 class="w-4 h-4" />
            </button>

            <div class="mt-auto">
              <h3 class="font-bold text-white text-xs md:text-sm mb-1 line-clamp-2 leading-tight">{{ item.title || item.name }}</h3>
              
              <div class="flex items-center gap-2 text-[10px] md:text-xs text-zinc-300 mb-2 md:mb-3">
                <span class="flex items-center gap-1 text-yellow-500">
                  <Star class="w-3 h-3 fill-current" /> {{ item.vote_average?.toFixed(1) }}
                </span>
                <span>{{ item.release_date?.split('-')[0] }}</span>
              </div>

              <div class="grid grid-cols-2 gap-2">
                <button 
                  @click.stop="playMovie(item)"
                  class="bg-red-600 hover:bg-red-700 text-white py-1.5 md:py-2 rounded-lg font-bold text-[10px] md:text-xs flex items-center justify-center gap-1 transition-colors shadow-lg"
                >
                  <Play class="w-3 h-3 fill-current" /> Watch
                </button>
                <button 
                  @click.stop="openDetailModal(item)"
                  class="bg-zinc-700 hover:bg-zinc-600 text-white py-1.5 md:py-2 rounded-lg font-bold text-[10px] md:text-xs flex items-center justify-center gap-1 transition-colors shadow-lg"
                >
                  <Info class="w-3 h-3" /> Info
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="selectedMovie" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/90 backdrop-blur-md" @click="closeModal"></div>
      
      <div class="relative bg-zinc-900 w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] border border-zinc-800">
        <button @click="closeModal" class="absolute top-4 right-4 z-20 p-2 bg-black/50 rounded-full hover:bg-white hover:text-black transition-all">
          <X class="w-5 h-5" />
        </button>

        <div class="hidden md:block w-1/3 relative">
          <img :src="getImageUrl(selectedMovie.poster_path, 'poster', 'large')" class="w-full h-full object-cover"/>
          <div class="absolute inset-0 bg-gradient-to-r from-transparent to-zinc-900"></div>
        </div>

        <div class="flex-1 p-8 md:p-10 overflow-y-auto">
           <div class="md:hidden w-full h-48 mb-6 rounded-xl overflow-hidden relative">
               <img :src="getImageUrl(selectedMovie.backdrop_path, 'backdrop', 'medium')" class="w-full h-full object-cover" />
           </div>

           <h2 class="text-3xl md:text-5xl font-black mb-2">{{ selectedMovie.title }}</h2>
           
           <div class="flex items-center gap-4 text-zinc-400 text-sm font-bold uppercase tracking-wide mb-6">
             <span class="px-2 py-0.5 border border-zinc-700 rounded">{{ selectedMovie.release_date?.split('-')[0] }}</span>
             <span class="flex items-center gap-1 text-yellow-500"><Star class="w-4 h-4 fill-current"/> {{ selectedMovie.vote_average?.toFixed(1) }}</span>
           </div>

           <p class="text-zinc-300 text-lg leading-relaxed mb-8">{{ selectedMovie.overview }}</p>
           
           <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <button @click="playMovie(selectedMovie)" class="col-span-1 sm:col-span-2 py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg flex justify-center items-center gap-2">
               <Play class="w-5 h-5 fill-current" /> WATCH MOVIE
             </button>
             <button @click="removeFromFavorites(selectedMovie.id); closeModal()" class="py-3 bg-zinc-800 text-red-500 font-bold rounded-xl hover:bg-zinc-700 transition-all flex justify-center items-center gap-2">
               <Trash2 class="w-5 h-5" /> Remove from List
             </button>
           </div>
        </div>
      </div>
    </div>

    <div v-if="isVideoOpen" class="fixed inset-0 z-[60] bg-black flex flex-col">
      <div class="flex justify-between items-center p-4 bg-zinc-900 border-b border-zinc-800 text-white">
        <span class="font-bold text-lg flex items-center gap-2">
          <span class="text-red-600 animate-pulse">●</span> {{ currentVideoTitle }}
        </span>
        <button @click="closeVideo" class="flex items-center gap-2 px-4 py-2 bg-zinc-800 rounded-full hover:bg-white hover:text-black transition-colors font-bold text-xs uppercase">
          <X class="w-4 h-4" /> Close Player
        </button>
      </div>
      
      <div class="flex-1 relative bg-black">
        <iframe
          v-if="videoUrl"
          :src="videoUrl"
          class="absolute inset-0 w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Heart, X, Play, Info, Star, Trash2 } from 'lucide-vue-next'
import { getImageUrl } from '../services/tmdb.js'

const favorites = ref([])
const selectedMovie = ref(null)
const isVideoOpen = ref(false)
const videoUrl = ref('')
const currentVideoTitle = ref('')

const loadFavorites = () => {
  const saved = localStorage.getItem('movieFavorites')
  favorites.value = saved ? JSON.parse(saved) : []
}

const removeFromFavorites = (id) => {
  favorites.value = favorites.value.filter(item => item.id !== id)
  localStorage.setItem('movieFavorites', JSON.stringify(favorites.value))
}

const clearAll = () => {
  if (confirm('Are you sure you want to delete your entire list?')) {
    favorites.value = []
    localStorage.removeItem('movieFavorites')
  }
}

const openDetailModal = (movie) => {
  selectedMovie.value = movie
}

const closeModal = () => {
  selectedMovie.value = null
}

const playMovie = (movie) => {
  currentVideoTitle.value = movie.title || movie.name
  videoUrl.value = `https://vidsrc.xyz/embed/movie/${movie.id}`
  isVideoOpen.value = true
  closeModal()
}

const closeVideo = () => {
  isVideoOpen.value = false
  videoUrl.value = ''
}

onMounted(() => {
  loadFavorites()
})
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.5s ease-out forwards;
}
</style>