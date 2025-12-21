<template>
  <div class="relative overflow-hidden min-h-screen bg-black text-white">
    
    <div class="relative h-[85vh] w-full flex items-center justify-center overflow-hidden bg-black">
      <div class="absolute inset-0 z-0">
        <transition-group name="hero-fade">
          <div 
            v-if="currentBackgroundMovie"
            :key="currentBackgroundMovie.id"
            class="absolute inset-0 w-full h-full"
          >
            <div 
              class="absolute inset-0 bg-cover bg-center animate-ken-burns"
              :style="{ backgroundImage: `url(${getImageUrl(currentBackgroundMovie.backdrop_path, 'backdrop', 'original')})` }"
            ></div>
          </div>
        </transition-group>

        <div class="absolute inset-0 bg-black/40"></div>
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_80%,#000000_100%)]"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/60"></div>
      </div>

      <div class="relative z-20 container mx-auto px-4 flex flex-col items-center text-center">
        <div v-if="currentBackgroundMovie" class="mb-6 animate-fade-in-down">
          <span class="px-3 py-1 rounded-full border border-white/20 bg-black/30 backdrop-blur-md text-xs font-medium text-gray-300 tracking-widest uppercase shadow-lg">
            Featured: {{ currentBackgroundMovie.title }}
          </span>
        </div>

        <h1 class="text-5xl md:text-8xl lg:text-9xl font-black mb-6 tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-500 drop-shadow-2xl">
          UNLIMITED MOVIES
        </h1>
        
        <p class="text-lg md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto font-light leading-relaxed">
          Discover, explore, and watch thousands of movies at your fingertips.
        </p>
        
        <div class="w-full max-w-2xl relative group z-30">
          <div class="absolute -inset-1 bg-gradient-to-r from-red-600 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div class="relative flex items-center">
            <div class="absolute left-6 text-gray-400 group-focus-within:text-red-500 transition-colors">
              <Search class="w-6 h-6" />
            </div>
            <input 
              type="text" 
              v-model="searchQuery"
              @input="handleSearch"
              class="w-full pl-16 pr-6 py-5 bg-black/60 border border-white/10 rounded-full text-white text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 shadow-2xl backdrop-blur-xl"
              placeholder="What do you want to watch today?" 
            />
            <div class="absolute right-3">
               <button class="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg transition-transform active:scale-90">
                  <Search class="w-4 h-4" />
               </button>
            </div>
          </div>
        </div>
      </div>

      <div class="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce opacity-50">
        <ChevronDown class="w-10 h-10 text-white" />
      </div>
    </div>

    <div class="container mx-auto px-4 py-12 space-y-16">

      <section v-if="searchQuery && searchResults.length > 0">
        <h2 class="text-3xl font-black mb-6 tracking-tight flex items-center gap-2">
          <Search class="w-6 h-6 text-red-600" /> SEARCH RESULTS
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <div 
            v-for="movie in searchResults" 
            :key="movie.id"
            class="group relative cursor-pointer transform transition-all duration-500 lg:hover:scale-110 hover:z-10 aspect-[2/3] rounded-xl overflow-hidden shadow-lg"
          >
            <img :src="getImageUrl(movie.poster_path, 'poster', 'medium')" class="w-full h-full object-cover" />
            
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end p-4">
              <h3 class="text-sm font-bold mb-2 text-center text-white line-clamp-1">{{ movie.title }}</h3>
              <div class="flex flex-col gap-2 w-full">
                <button @click.stop="playMovie(movie)" class="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all active:scale-90">
                  <Play class="w-3.5 h-3.5 fill-current" /> Watch
                </button>
                <button @click.stop="openDetailModal(movie)" class="w-full bg-zinc-800/90 backdrop-blur-md hover:bg-zinc-700 text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all border border-white/10 active:scale-90">
                  <Info class="w-3.5 h-3.5" /> Info
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section v-for="section in sections" :key="section.title" v-show="!searchQuery">
        <h2 class="text-3xl font-black mb-6 tracking-tight border-l-4 pl-4" :class="section.borderColor">{{ section.title }}</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <div 
            v-for="movie in section.data" 
            :key="movie.id" 
            class="group relative cursor-pointer transform transition-all duration-500 lg:hover:scale-110 hover:z-10 aspect-[2/3] rounded-xl overflow-hidden shadow-lg"
          >
            <img :src="getImageUrl(movie.poster_path, 'poster', 'medium')" class="w-full h-full object-cover" />
            
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end p-4">
              <h3 class="text-sm font-bold mb-2 text-center text-white line-clamp-1">{{ movie.title }}</h3>
              <div class="flex flex-col gap-2 w-full">
                <button @click.stop="playMovie(movie)" class="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all active:scale-90">
                  <Play class="w-3.5 h-3.5 fill-current" /> Watch
                </button>
                <button @click.stop="openDetailModal(movie)" class="w-full bg-zinc-800/90 backdrop-blur-md hover:bg-zinc-700 text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all border border-white/10 active:scale-90">
                  <Info class="w-3.5 h-3.5" /> Info
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <div v-if="selectedMovie" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
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
           <div class="flex items-center gap-4 text-zinc-400 text-sm font-bold uppercase mb-6">
             <span class="px-2 py-0.5 border border-zinc-700 rounded">{{ selectedMovie.release_date?.split('-')[0] }}</span>
             <span class="flex items-center gap-1 text-yellow-500"><Star class="w-4 h-4 fill-current"/> {{ selectedMovie.vote_average?.toFixed(1) }}</span>
           </div>
           <p class="text-zinc-300 text-lg leading-relaxed mb-8">{{ selectedMovie.overview }}</p>
           
           <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <button @click="playMovie(selectedMovie)" class="col-span-1 sm:col-span-2 py-4 bg-red-600 text-white font-black rounded-xl hover:bg-red-700 transition-all duration-300 shadow-[0_0_20px_rgba(220,38,38,0.3)] flex justify-center items-center gap-2 active:scale-95 transform hover:-translate-y-1">
               <Play class="w-5 h-5 fill-current" /> WATCH MOVIE
             </button>
             <button @click="playTrailer(selectedMovie)" class="py-3 bg-zinc-800/80 backdrop-blur text-white font-bold rounded-xl hover:bg-zinc-700 transition-all duration-300 flex justify-center items-center gap-2 active:scale-95 border border-white/5 transform hover:-translate-y-1">
               <Youtube class="w-5 h-5 text-red-500" /> Trailer
             </button>
             <button @click="addToFavorites(selectedMovie)" class="py-3 bg-zinc-800/80 backdrop-blur text-white font-bold rounded-xl hover:bg-zinc-700 transition-all duration-300 flex justify-center items-center gap-2 active:scale-95 border border-white/5 transform hover:-translate-y-1">
               <Plus class="w-5 h-5 text-blue-500" /> My List
             </button>
           </div>
        </div>
      </div>
    </div>

    <div v-if="isVideoOpen" class="fixed inset-0 z-[100] bg-black flex flex-col">
      <div class="flex justify-between items-center p-4 bg-black/80 backdrop-blur border-b border-zinc-800">
        <span class="font-bold text-lg"><span class="text-red-600">PLAYING:</span> {{ currentVideoTitle }}</span>
        <button @click="closeVideo" class="flex items-center gap-2 px-4 py-2 bg-zinc-800 rounded-full hover:bg-white hover:text-black transition-colors font-bold uppercase text-xs">
          <X class="w-4 h-4" /> Close
        </button>
      </div>
      <div class="flex-1 relative">
        <iframe v-if="videoUrl" :src="videoUrl" class="absolute inset-0 w-full h-full border-0" allowfullscreen allow="autoplay"></iframe>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Search, Play, Info, Star, X, Youtube, Plus, ChevronDown } from 'lucide-vue-next'
import { 
  getTrendingMovies, 
  getPopularMovies, 
  searchMovies, 
  getMovieVideos,
  getImageUrl,
  getTopRatedMovies, 
} from '../services/tmdb.js'

const searchQuery = ref('')
const searchResults = ref([])
const trendingMovies = ref([])
const popularMovies = ref([])
const topRatedMovies = ref([])
const heroMovies = ref([])
const currentHeroIndex = ref(0)
let heroInterval = null

const isVideoOpen = ref(false)
const videoUrl = ref('')
const currentVideoTitle = ref('')
const selectedMovie = ref(null)
let searchTimeout = null

const sections = computed(() => [
  { title: 'TRENDING NOW', data: trendingMovies.value, borderColor: 'border-red-600' },
  { title: 'POPULAR MOVIES', data: popularMovies.value, borderColor: 'border-blue-600' },
  { title: 'TOP RATED MOVIES', data: topRatedMovies.value, borderColor: 'border-green-600' }
])

const currentBackgroundMovie = computed(() => heroMovies.value[currentHeroIndex.value])

onMounted(async () => {
  try {
    const trendingData = await getTrendingMovies('day')
    heroMovies.value = trendingData.results.filter(m => m.backdrop_path).slice(0, 10)
    heroInterval = setInterval(() => {
      currentHeroIndex.value = (currentHeroIndex.value + 1) % heroMovies.value.length
    }, 10000)
    trendingMovies.value = trendingData.results.slice(0, 12)
    const popularData = await getPopularMovies(1)
    popularMovies.value = popularData.results.slice(0, 12)
    const topRatedData = await getTopRatedMovies()
    topRatedMovies.value = topRatedData.results.slice(0, 12)
  } catch (error) { console.error(error) }
})

onUnmounted(() => clearInterval(heroInterval))

const handleSearch = () => {
  clearTimeout(searchTimeout)
  if (!searchQuery.value.trim()) { searchResults.value = []; return }
  searchTimeout = setTimeout(async () => {
    const data = await searchMovies(searchQuery.value)
    searchResults.value = data.results
  }, 500)
}

const openDetailModal = (movie) => selectedMovie.value = movie
const closeModal = () => selectedMovie.value = null

const playMovie = (movie) => {
  currentVideoTitle.value = movie.title
  videoUrl.value = `https://vidsrc.xyz/embed/movie/${movie.id}`
  isVideoOpen.value = true
  closeModal()
}

const playTrailer = async (movie) => {
  try {
    const data = await getMovieVideos(movie.id)
    const trailer = data.results.find(v => v.type === 'Trailer' && v.site === 'YouTube')
    if (trailer) {
      currentVideoTitle.value = `${movie.title} (Trailer)`
      videoUrl.value = `https://www.youtube.com/embed/${trailer.key}?autoplay=1`
      isVideoOpen.value = true
      closeModal()
    } else {
      alert('Trailer not found for this movie.')
    }
  } catch (error) { console.error(error) }
}

const addToFavorites = (movie) => {
  const favorites = JSON.parse(localStorage.getItem('movieFavorites') || '[]')
  if (!favorites.find(fav => fav.id === movie.id)) {
    favorites.push(movie)
    localStorage.setItem('movieFavorites', JSON.stringify(favorites))
    alert(`${movie.title} added to My List!`)
  } else {
    alert(`${movie.title} is already in your list.`)
  }
}

const closeVideo = () => { isVideoOpen.value = false; videoUrl.value = '' }
</script>

<style scoped>
@keyframes ken-burns {
  0% { transform: scale(1); }
  100% { transform: scale(1.1); }
}
.animate-ken-burns { animation: ken-burns 20s ease-in-out infinite alternate; }
.hero-fade-enter-active, .hero-fade-leave-active { transition: opacity 1s; }
.hero-fade-enter-from, .hero-fade-leave-to { opacity: 0; }
</style>