<template>
  <div class="relative overflow-hidden min-h-screen bg-black text-white">
    
    <!-- === HERO SECTION (Kept your original design) === -->
    <!-- WRAPPER -->
  <div class="relative h-[85vh] w-full flex items-center justify-center overflow-hidden bg-black">
    
    <!-- ========================================== -->
    <!-- 1. DYNAMIC BACKGROUND LAYER                -->
    <!-- ========================================== -->
    <div class="absolute inset-0 z-0">
      <transition-group name="hero-fade">
        <div 
          v-if="currentBackgroundMovie"
          :key="currentBackgroundMovie.id"
          class="absolute inset-0 w-full h-full"
        >
          <!-- Image with 'Ken Burns' Zoom Effect -->
          <div 
            class="absolute inset-0 bg-cover bg-center animate-ken-burns"
            :style="{ backgroundImage: `url(${getImageUrl(currentBackgroundMovie.backdrop_path, 'backdrop', 'original')})` }"
          ></div>
        </div>
      </transition-group>

      <!-- CINEMATIC OVERLAYS (Crucial for text readability) -->
      <!-- Darkens the image generally -->
      <div class="absolute inset-0 bg-black/40"></div>
      <!-- Radial gradient to spotlight the center text -->
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_80%,#000000_100%)]"></div>
      <!-- Vertical gradient for smooth blend into next section -->
      <div class="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/60"></div>
    </div>

    <!-- ========================================== -->
    <!-- 2. HERO CONTENT LAYER                      -->
    <!-- ========================================== -->
    <div class="relative z-20 container mx-auto px-4 flex flex-col items-center text-center">
      
      <!-- 'Now Showing' Badge (Optional cool feature) -->
      <div v-if="currentBackgroundMovie" class="mb-6 animate-fade-in-down">
        <span class="px-3 py-1 rounded-full border border-white/20 bg-black/30 backdrop-blur-md text-xs font-medium text-gray-300 tracking-widest uppercase shadow-lg">
          Featured: {{ currentBackgroundMovie.title }}
        </span>
      </div>

      <!-- Main Headline -->
      <h1 class="text-6xl md:text-8xl lg:text-9xl font-black mb-6 tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-500 drop-shadow-2xl font-sans">
        UNLIMITED MOVIES
      </h1>
      
      <!-- Subheadline -->
      <p class="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto font-light leading-relaxed drop-shadow-md">
        Discover, explore, and watch thousands of movies at your fingertips.
      </p>
      
      <!-- PREMIUM SEARCH BAR -->
      <div class="w-full max-w-2xl relative group z-30">
        <!-- Glow Effect behind search bar -->
        <div class="absolute -inset-1 bg-gradient-to-r from-red-600 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        
        <div class="relative flex items-center">
          <!-- Animated Icon -->
          <div class="absolute left-6 pointer-events-none text-gray-400 group-focus-within:text-red-500 transition-colors duration-300">
            <Search class="w-6 h-6 group-focus-within:animate-pulse" />
          </div>

          <input 
            type="text" 
            v-model="searchQuery"
            @input="handleSearch"
            class="w-full pl-16 pr-6 py-5 bg-black/60 border border-white/10 rounded-full text-white text-lg placeholder-gray-400 focus:outline-none focus:bg-black/80 focus:ring-2 focus:ring-red-500/50 focus:border-red-500 shadow-2xl backdrop-blur-xl transition-all duration-300"
            placeholder="What do you want to watch today?" 
          />
          
          <!-- Optional 'Cmd+K' visual hint or Search Button -->
          <div class="absolute right-3">
             <button class="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-transform hover:scale-105 shadow-lg">
                <Search class="w-4 h-4" />
             </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Scroll Indicator (Bottom Center) -->
    <div class="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
      <ChevronDown class="w-10 h-10 text-white" />
    </div>

  </div>


    <!-- === MAIN CONTENT CONTAINER === -->
    <div class="container mx-auto px-4 py-12 space-y-16">

      <!-- 1. SEARCH RESULTS (Only shows when searching) -->
      <section v-if="searchQuery && searchResults.length > 0">
        <h2 class="text-3xl font-black mb-6 tracking-tight flex items-center gap-2">
          <Search class="w-6 h-6 text-red-600" /> SEARCH RESULTS
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <!-- CARD COMPONENT -->
          <div 
            v-for="movie in searchResults" 
            :key="movie.id"
            class="group relative cursor-pointer transform transition-all duration-300 hover:scale-105 hover:z-10 aspect-[2/3]"
          >
            <img 
              :src="getImageUrl(movie.poster_path, 'poster', 'medium')" 
              :alt="movie.title"
              class="w-full h-full object-cover rounded-xl shadow-lg"
            />
            <!-- HOVER OVERLAY (Exact copy from Movie.vue) -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex flex-col items-center justify-center p-4">
              <h3 class="text-sm font-bold mb-2 text-center line-clamp-2">{{ movie.title }}</h3>
              <div class="flex items-center gap-2 text-xs text-gray-300 mb-3">
                <Star class="w-3 h-3 text-yellow-500 fill-current" />
                {{ movie.vote_average?.toFixed(1) }}
              </div>
              <div class="flex flex-col gap-2 w-full">
                <button @click.stop="playMovie(movie)" class="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-xs font-bold transition-transform hover:scale-105 shadow-lg flex items-center justify-center gap-1">
                  <Play class="w-3 h-3 fill-current" /> Watch
                </button>
                <button @click.stop="openDetailModal(movie)" class="w-full bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-2 rounded-lg text-xs font-bold transition-transform hover:scale-105 shadow-lg flex items-center justify-center gap-1">
                  <Info class="w-3 h-3" /> Info
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 2. TRENDING NOW -->
      <section v-if="!searchQuery">
        <h2 class="text-3xl font-black mb-6 tracking-tight flex items-center gap-2 border-l-4 border-red-600 pl-4">
          TRENDING NOW
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div 
            v-for="movie in trendingMovies" 
            :key="movie.id"
            class="group relative cursor-pointer transform transition-all duration-300 hover:scale-105 hover:z-10 aspect-[2/3]"
          >
            <img 
              :src="getImageUrl(movie.poster_path, 'poster', 'medium')" 
              class="w-full h-full object-cover rounded-xl shadow-lg"
            />
            <!-- HOVER OVERLAY -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex flex-col items-center justify-center p-4">
              <h3 class="text-sm font-bold mb-2 text-center line-clamp-2">{{ movie.title }}</h3>
              <div class="flex items-center gap-2 text-xs text-gray-300 mb-3">
                <Star class="w-3 h-3 text-yellow-500 fill-current" />
                {{ movie.vote_average?.toFixed(1) }}
              </div>
              <div class="flex flex-col gap-2 w-full">
                <button @click.stop="playMovie(movie)" class="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-xs font-bold transition-transform hover:scale-105 shadow-lg flex items-center justify-center gap-1">
                  <Play class="w-3 h-3 fill-current" /> Watch
                </button>
                <button @click.stop="openDetailModal(movie)" class="w-full bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-2 rounded-lg text-xs font-bold transition-transform hover:scale-105 shadow-lg flex items-center justify-center gap-1">
                  <Info class="w-3 h-3" /> Info
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 3. POPULAR MOVIES -->
      <section v-if="!searchQuery">
        <h2 class="text-3xl font-black mb-6 tracking-tight flex items-center gap-2 border-l-4 border-blue-600 pl-4">
          POPULAR MOVIES
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div 
            v-for="movie in popularMovies" 
            :key="movie.id"
            class="group relative cursor-pointer transform transition-all duration-300 hover:scale-105 hover:z-10 aspect-[2/3]"
          >
            <img 
              :src="getImageUrl(movie.poster_path, 'poster', 'medium')" 
              class="w-full h-full object-cover rounded-xl shadow-lg"
            />
            <!-- HOVER OVERLAY -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex flex-col items-center justify-center p-4">
              <h3 class="text-sm font-bold mb-2 text-center line-clamp-2">{{ movie.title }}</h3>
              <div class="flex items-center gap-2 text-xs text-gray-300 mb-3">
                <Star class="w-3 h-3 text-yellow-500 fill-current" />
                {{ movie.vote_average?.toFixed(1) }}
              </div>
              <div class="flex flex-col gap-2 w-full">
                <button @click.stop="playMovie(movie)" class="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-xs font-bold transition-transform hover:scale-105 shadow-lg flex items-center justify-center gap-1">
                  <Play class="w-3 h-3 fill-current" /> Watch
                </button>
                <button @click.stop="openDetailModal(movie)" class="w-full bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-2 rounded-lg text-xs font-bold transition-transform hover:scale-105 shadow-lg flex items-center justify-center gap-1">
                  <Info class="w-3 h-3" /> Info
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 3. TOP RATED MOVIES -->
<section v-if="!searchQuery">
  <h2 class="text-3xl font-black mb-6 tracking-tight flex items-center gap-2 border-l-4 border-green-600 pl-4">
    TOP RATED MOVIES
  </h2>
  
  <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
    
    <!-- CHANGE THE V-FOR BELOW -->
    <div 
      v-for="movie in topRatedMovies" 
      :key="movie.id"
      class="group relative cursor-pointer transform transition-all duration-300 hover:scale-105 hover:z-10 aspect-[2/3]"
    >
      <!-- The rest remains the same -->
      <img 
        :src="getImageUrl(movie.poster_path, 'poster', 'medium')" 
        class="w-full h-full object-cover rounded-xl shadow-lg"
      />
      
      <!-- HOVER OVERLAY -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex flex-col items-center justify-center p-4">
        <h3 class="text-sm font-bold mb-2 text-center line-clamp-2">{{ movie.title }}</h3>
        <div class="flex items-center gap-2 text-xs text-gray-300 mb-3">
          <Star class="w-3 h-3 text-yellow-500 fill-current" />
          {{ movie.vote_average?.toFixed(1) }}
        </div>
        <div class="flex flex-col gap-2 w-full">
          <button @click.stop="playMovie(movie)" class="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-xs font-bold transition-transform hover:scale-105 shadow-lg flex items-center justify-center gap-1">
            <Play class="w-3 h-3 fill-current" /> Watch
          </button>
          <button @click.stop="openDetailModal(movie)" class="w-full bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-2 rounded-lg text-xs font-bold transition-transform hover:scale-105 shadow-lg flex items-center justify-center gap-1">
            <Info class="w-3 h-3" /> Info
          </button>
        </div>
      </div>

    </div>
  </div>
</section>


    </div>

    <!-- === MOVIE DETAILS MODAL (Consolidated) === -->
    <div v-if="selectedMovie" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/90 backdrop-blur-md" @click="closeModal"></div>
      
      <div class="relative bg-zinc-900 w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] border border-zinc-800">
        <button @click="closeModal" class="absolute top-4 right-4 z-20 p-2 bg-black/50 rounded-full hover:bg-white hover:text-black transition-all">
          <X class="w-5 h-5" />
        </button>

        <!-- Poster (Desktop) -->
        <div class="hidden md:block w-1/3 relative">
          <img :src="getImageUrl(selectedMovie.poster_path, 'poster', 'large')" class="w-full h-full object-cover"/>
          <div class="absolute inset-0 bg-gradient-to-r from-transparent to-zinc-900"></div>
        </div>

        <!-- Content -->
        <div class="flex-1 p-8 md:p-10 overflow-y-auto">
           <!-- Mobile Backdrop -->
           <div class="md:hidden w-full h-48 mb-6 rounded-xl overflow-hidden relative">
               <img :src="getImageUrl(selectedMovie.backdrop_path, 'backdrop', 'medium')" class="w-full h-full object-cover" />
           </div>

           <h2 class="text-3xl md:text-5xl font-black mb-2">{{ selectedMovie.title }}</h2>
           
           <div class="flex items-center gap-4 text-zinc-400 text-sm font-bold uppercase tracking-wide mb-6">
             <span class="px-2 py-0.5 border border-zinc-700 rounded">{{ selectedMovie.release_date?.split('-')[0] }}</span>
             <span class="flex items-center gap-1 text-yellow-500"><Star class="w-4 h-4 fill-current"/> {{ selectedMovie.vote_average?.toFixed(1) }}</span>
           </div>

           <p class="text-zinc-300 text-lg leading-relaxed mb-8">{{ selectedMovie.overview }}</p>
           
           <!-- Buttons -->
           <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <button @click="playMovie(selectedMovie)" class="col-span-1 sm:col-span-2 py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg flex justify-center items-center gap-2">
               <Play class="w-5 h-5 fill-current" /> WATCH MOVIE
             </button>
             
             <button @click="playTrailer(selectedMovie)" class="py-3 bg-zinc-800 text-white font-bold rounded-xl hover:bg-zinc-700 transition-all flex justify-center items-center gap-2">
               <Youtube class="w-5 h-5" /> Trailer
             </button>
             
             <button @click="addToFavorites(selectedMovie)" class="py-3 bg-zinc-800 text-white font-bold rounded-xl hover:bg-zinc-700 transition-all flex justify-center items-center gap-2">
               <Plus class="w-5 h-5" /> My List
             </button>
           </div>
        </div>
      </div>
    </div>

    <!-- === GLOBAL VIDEO PLAYER OVERLAY === -->
    <div v-if="isVideoOpen" class="fixed inset-0 z-[100] bg-black flex flex-col">
      <div class="flex justify-between items-center p-4 bg-black/80 backdrop-blur text-white border-b border-zinc-800">
        <span class="font-bold text-lg flex items-center gap-2">
          <span class="text-red-600">PLAYING:</span> {{ currentVideoTitle }}
        </span>
        <button @click="closeVideo" class="flex items-center gap-2 px-4 py-2 bg-zinc-800 rounded-full hover:bg-white hover:text-black transition-colors">
          <X class="w-4 h-4" /> Close
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
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Search, Play, Info, Star, X, Youtube, Plus } from 'lucide-vue-next'
import { 
  getTrendingMovies, 
  getPopularMovies, 
  searchMovies, 
  getMovieVideos,
  getImageUrl,
  getTopRatedMovies, 
} from '../services/tmdb.js'

// ================= DATA REFS =================
const searchQuery = ref('')
const searchResults = ref([])
const trendingMovies = ref([])
const popularMovies = ref([])
const selectedMovie = ref(null)
const topRatedMovies = ref([])

// ================= HERO SLIDESHOW (ADDED) =================
const heroMovies = ref([])
const currentHeroIndex = ref(0)
let heroInterval = null

const currentBackgroundMovie = computed(() => {
  return heroMovies.value[currentHeroIndex.value]
})

// ================= VIDEO PLAYER =================
const isVideoOpen = ref(false)
const videoUrl = ref('')
const currentVideoTitle = ref('')

let searchTimeout = null

// ================= API LOADING =================
onMounted(async () => {
  try {
    const trendingData = await getTrendingMovies('day')

    // 🔹 HERO SLIDESHOW DATA (ONLY ADDITION)
    heroMovies.value = trendingData.results
      .filter(movie => movie.backdrop_path)
      .slice(0, 10)

    heroInterval = setInterval(() => {
      currentHeroIndex.value =
        (currentHeroIndex.value + 1) % heroMovies.value.length
    }, 10000)

    // EXISTING LOGIC (UNCHANGED)
    trendingMovies.value = trendingData.results.slice(0, 12)

    const popularData = await getPopularMovies(1)
    popularMovies.value = popularData.results.slice(0, 12)

    const topRatedData = await getTopRatedMovies()
    topRatedMovies.value = topRatedData.results

  } catch (error) {
    console.error('Error fetching home movies:', error)
  }
})

onUnmounted(() => {
  clearInterval(heroInterval)
})

// ================= SEARCH =================
const handleSearch = () => {
  clearTimeout(searchTimeout)
  if (searchQuery.value.trim() === '') {
    searchResults.value = []
    return
  }

  searchTimeout = setTimeout(async () => {
    try {
      const data = await searchMovies(searchQuery.value)
      searchResults.value = data.results
    } catch (error) {
      console.error(error)
    }
  }, 500)
}

// ================= MODAL & PLAYER =================
const openDetailModal = (movie) => {
  selectedMovie.value = movie
}

const closeModal = () => {
  selectedMovie.value = null
}

const playMovie = (movie) => {
  currentVideoTitle.value = movie.title
  videoUrl.value = `https://vidsrc.xyz/embed/movie/${movie.id}`
  isVideoOpen.value = true
  closeModal()
}

const playTrailer = async (movie) => {
  try {
    const data = await getMovieVideos(movie.id)
    const trailer = data.results.find(
      v => v.type === 'Trailer' && v.site === 'YouTube'
    )
    if (trailer) {
      currentVideoTitle.value = `${movie.title} (Trailer)`
      videoUrl.value = `https://www.youtube.com/embed/${trailer.key}?autoplay=1`
      isVideoOpen.value = true
      closeModal()
    } else {
      alert('No trailer available')
    }
  } catch (e) {
    console.error(e)
  }
}

const closeVideo = () => {
  isVideoOpen.value = false
  videoUrl.value = ''
}

const addToFavorites = (movie) => {
  const favorites = JSON.parse(localStorage.getItem('movieFavorites') || '[]')
  if (!favorites.find(fav => fav.id === movie.id)) {
    favorites.push(movie)
    localStorage.setItem('movieFavorites', JSON.stringify(favorites))
    alert('Added to My List!')
  } else {
    alert('Already in My List!')
  }
}
</script>
<style scoped>
@keyframes ken-burns {
  0% {
    transform: scale(1) translate(0, 0);
  }
  100% {
    transform: scale(1.1) translate(-5%, -5%);
  }
}
.animate-ken-burns {
  animation: ken-burns 20s ease-in-out infinite alternate;
}
.hero-fade-enter-active, .hero-fade-leave-active {
  transition: opacity 1s;
}
.hero-fade-enter-from, .hero-fade-leave-to {
  opacity: 0;
}
.animate-fade-in-down {
  animation: fade-in-down 1s ease-out;
}
@keyframes fade-in-down {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}


</style>

