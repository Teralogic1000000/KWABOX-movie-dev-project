<template>
  <div class="min-h-screen bg-black text-white pb-16">
    
    <!-- 1. HERO BANNER -->
    <div v-if="movies.length > 0 && !selectedGenre && !route.query.q" class="relative h-[85vh] w-full overflow-hidden">
      <div class="absolute inset-0">
        <img 
          :src="getImageUrl(currentFeaturedMovie.backdrop_path, 'backdrop', 'original')" 
          class="w-full h-full object-cover"
          alt="Hero Background"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"></div>
      </div>

      <div class="relative z-10 flex flex-col justify-center h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <h1 class="text-5xl md:text-7xl font-black leading-tight drop-shadow-2xl">
          {{ currentFeaturedMovie.title }}
        </h1>
        <p class="text-lg md:text-xl text-zinc-200 line-clamp-3 md:line-clamp-2 max-w-2xl drop-shadow-md">
          {{ currentFeaturedMovie.overview }}
        </p>
        
        <div class="flex flex-wrap gap-4 mt-4">
          <button 
            @click="playMovie(currentFeaturedMovie)"
            class="px-8 py-4 bg-red-600 text-white text-lg font-bold rounded-xl hover:bg-red-700 transition-all shadow-[0_0_30px_rgba(220,38,38,0.4)] flex items-center gap-3"
          >
            <Play class="w-6 h-6 fill-current" /> Watch Movie
          </button>
          <button 
            @click="openModal(currentFeaturedMovie)"
            class="px-8 py-4 bg-white/10 backdrop-blur-md text-white text-lg font-bold rounded-xl hover:bg-white/20 transition-all border border-white/20 flex items-center gap-3"
          >
            <Info class="w-6 h-6" /> More Info
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20" :class="{ '-mt-10': !selectedGenre && !route.query.q, 'pt-24': selectedGenre || route.query.q }">
      
      <!-- === HEADER & FILTERS === -->
      <div class="mb-8 space-y-6">
        
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <h2 class="text-3xl font-black text-white tracking-tight">
            <span v-if="route.query.q">Search: "{{ route.query.q }}"</span>
            <span v-else-if="selectedGenre">Genre: {{ getGenreName(selectedGenre) }}</span>
            <span v-else>Discover Movies</span>
          </h2>
          
          <div v-if="!route.query.q && !selectedGenre" class="flex flex-wrap gap-3">
            <button
              v-for="filter in filters"
              :key="filter.id"
              @click="setMainFilter(filter.id)"
              :class="[`
                px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 uppercase tracking-wide
                ${activeFilter === filter.id ? 'bg-red-600 text-white shadow-lg scale-105' : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'}
              `]"
            >
              {{ filter.name }}
            </button>
          </div>
          
          <button 
            v-if="selectedGenre" 
            @click="clearGenre"
            class="px-4 py-2 bg-zinc-800 text-white rounded-full flex items-center gap-2 hover:bg-red-600 transition-colors"
          >
            <X class="w-4 h-4" /> Clear Filter
          </button>
        </div>

        <!-- === COOL GENRE SCROLL BAR === -->
        <div v-if="!route.query.q" class="relative group">
          <div class="flex overflow-x-auto pb-4 gap-3 custom-scrollbar">
            <button
              v-for="genre in genreList"
              :key="genre.id"
              @click="setGenreFilter(genre.id)"
              :class="[`
                whitespace-nowrap px-5 py-2 rounded-xl text-sm font-bold border transition-all duration-300
                ${selectedGenre === genre.id ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)] transform scale-105' : 'bg-black/40 border-zinc-800 text-zinc-400 hover:border-zinc-500 hover:text-white backdrop-blur-sm'}
              `]"
            >
              {{ genre.name }}
            </button>
          </div>
        </div>

      </div>

      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div v-for="i in 12" :key="i" class="aspect-[2/3] bg-zinc-900 animate-pulse rounded-lg"></div>
      </div>

      <!-- MOVIES GRID -->
      <div v-else-if="movies.length > 0" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div
          v-for="movie in movies"
          :key="movie.id"
          class="group relative cursor-pointer transform transition-all duration-300 hover:scale-105 hover:z-10"
        >
          <img
            :src="getImageUrl(movie.poster_path, 'poster', 'medium')"
            :alt="movie.title"
            class="w-full h-auto rounded-lg shadow-lg group-hover:shadow-2xl group-hover:shadow-red-600/50 object-cover aspect-[2/3]"
            loading="lazy"
          />
          
          <!-- Hover Overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex flex-col items-center justify-center p-4">
            <h3 class="text-sm font-bold mb-2 text-center text-white line-clamp-2">{{ movie.title }}</h3>
            
            <div class="flex items-center gap-2 text-xs text-gray-300 mb-3">
              <span class="flex items-center gap-1">
                <Star class="w-3 h-3 text-yellow-500 fill-current" />
                {{ movie.vote_average?.toFixed(1) }}
              </span>
            </div>

            <div class="flex flex-col gap-2 w-full px-2">
              <button @click.stop="playMovie(movie)" class="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-xs font-semibold transition-all shadow-lg flex justify-center gap-2">
                <Play class="w-3 h-3 fill-current" /> Watch
              </button>
              <button @click.stop="openModal(movie)" class="w-full bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded-md text-xs font-semibold transition-all shadow-lg flex justify-center gap-2">
                <Info class="w-3 h-3" /> Info
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-16">
        <p class="text-zinc-500 text-lg">No movies found</p>
      </div>

      <!-- Load More -->
      <div v-if="!loading && movies.length > 0" class="mt-16 text-center">
        <button
          @click="loadMore"
          :disabled="loadingMore"
          class="px-10 py-3 bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold rounded-full hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-50 uppercase tracking-wide text-sm"
        >
          {{ loadingMore ? 'Loading...' : 'Load More Movies' }}
        </button>
      </div>
    </div>

    <!-- DETAIL MODAL -->
    <div v-if="selectedMovie" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/90 backdrop-blur-md" @click="closeModal"></div>
      <div class="relative bg-zinc-900 w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
        <button @click="closeModal" class="absolute top-4 right-4 z-20 p-2 bg-black/50 rounded-full hover:bg-white hover:text-black transition-all">
          <X class="w-5 h-5" />
        </button>
        <div class="hidden md:block w-1/3 relative">
          <img :src="getImageUrl(selectedMovie.poster_path, 'poster', 'large')" class="w-full h-full object-cover"/>
        </div>
        <div class="flex-1 p-8 md:p-10 overflow-y-auto">
           <h2 class="text-3xl md:text-5xl font-black mb-2">{{ selectedMovie.title }}</h2>
           <div class="flex items-center gap-4 text-zinc-400 text-sm font-bold uppercase tracking-wide mb-6">
             <span>{{ selectedMovie.release_date?.split('-')[0] }}</span>
             <span class="flex items-center gap-1 text-yellow-500"><Star class="w-4 h-4 fill-current"/> {{ selectedMovie.vote_average?.toFixed(1) }}</span>
           </div>
           <p class="text-zinc-300 text-lg leading-relaxed mb-8">{{ selectedMovie.overview }}</p>
           <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <button @click="playMovie(selectedMovie)" class="col-span-2 py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all flex justify-center items-center gap-2"><Play class="w-5 h-5 fill-current" /> WATCH MOVIE</button>
             <button @click="playTrailer(selectedMovie)" class="py-3 bg-zinc-800 text-white font-bold rounded-xl hover:bg-zinc-700 transition-all flex justify-center items-center gap-2"><Youtube class="w-5 h-5" /> Trailer</button>
             <button @click="addToFavorites(selectedMovie)" class="py-3 bg-zinc-800 text-white font-bold rounded-xl hover:bg-zinc-700 transition-all flex justify-center items-center gap-2"><Plus class="w-5 h-5" /> My List</button>
           </div>
        </div>
      </div>
    </div>

    <!-- VIDEO PLAYER OVERLAY (On-Site Watching) -->
    <div v-if="isVideoOpen" class="fixed inset-0 z-[60] bg-black flex flex-col">
      <div class="flex justify-between items-center p-4 bg-zinc-900 border-b border-zinc-800 text-white">
        <span class="font-bold text-lg flex items-center gap-2">
          <span class="text-red-600 animate-pulse">●</span> {{ currentVideoTitle }}
        </span>
        <button @click="closeVideo" class="flex items-center gap-2 px-4 py-2 bg-zinc-800 rounded-full hover:bg-white hover:text-black transition-colors">
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
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { X, Play, Info, Plus, Star, Youtube } from 'lucide-vue-next'
import {
  getPopularMovies,
  getTopRatedMovies,
  getNowPlayingMovies,
  getUpcomingMovies,
  getMovieVideos,
  searchMovies,
  getMovieGenres,
  getMoviesByGenre,
  getImageUrl
} from '../services/tmdb.js'

const route = useRoute()
const router = useRouter()

// Data refs
const movies = ref([])
const genreList = ref([])
const featuredMovie = ref(null)
const loading = ref(true)
const loadingMore = ref(false)
const selectedMovie = ref(null)

// Featured movie rotation
const featuredIndex = ref(0)
const currentFeaturedMovie = ref(null)

// Filter States
const activeFilter = ref('popular')
const selectedGenre = ref(null)
const currentPage = ref(1)

// Video Player refs
const isVideoOpen = ref(false)
const videoUrl = ref('')
const currentVideoTitle = ref('')

const filters = [
  { id: 'popular', name: 'Popular', fetchFn: getPopularMovies },
  { id: 'top_rated', name: 'Top Rated', fetchFn: getTopRatedMovies },
  { id: 'now_playing', name: 'Now Playing', fetchFn: getNowPlayingMovies },
  { id: 'upcoming', name: 'Upcoming', fetchFn: getUpcomingMovies }
]

// --- FETCH LOGIC ---
const fetchMovies = async (append = false) => {
  try {
    if (append) loadingMore.value = true
    else {
      loading.value = true
      currentPage.value = 1
      movies.value = []
    }

    let data
    if (route.query.q) {
      data = await searchMovies(route.query.q, currentPage.value)
      activeFilter.value = null
      selectedGenre.value = null
    } else if (selectedGenre.value) {
      data = await getMoviesByGenre(selectedGenre.value, currentPage.value)
      activeFilter.value = null
    } else {
      if (!activeFilter.value) activeFilter.value = 'popular'
      const filter = filters.find(f => f.id === activeFilter.value) || filters[0]
      data = await filter.fetchFn(currentPage.value)
    }

    if (append) movies.value = [...movies.value, ...data.results]
    else {
      movies.value = data.results
      if (!route.query.q && !selectedGenre.value && activeFilter.value === 'popular' && movies.value.length > 0) {
        currentFeaturedMovie.value = movies.value[0]
        featuredIndex.value = 0
      }
    }
  } catch (error) { console.error('Error fetching movies:', error) }
  finally { loading.value = false; loadingMore.value = false }
}

// --- FILTER HANDLERS ---
const setGenreFilter = (genreId) => {
  selectedGenre.value = genreId
  activeFilter.value = null
  router.push({ query: {} })
  fetchMovies()
}

const setMainFilter = (filterId) => {
  activeFilter.value = filterId
  selectedGenre.value = null
  router.push({ query: {} })
  fetchMovies()
}

const clearGenre = () => {
  selectedGenre.value = null
  activeFilter.value = 'popular'
  fetchMovies()
}

const getGenreName = (id) => {
  const g = genreList.value.find(g => g.id === id)
  return g ? g.name : 'Genre'
}

// --- WATCHERS ---
watch(() => route.query.q, () => fetchMovies())

// --- ACTIONS ---
const loadMore = () => { currentPage.value++; fetchMovies(true) }
const openModal = (movie) => { selectedMovie.value = movie }
const closeModal = () => { selectedMovie.value = null }

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
    } else alert("No trailer available")
  } catch(e) { console.error(e) }
}

const closeVideo = () => { isVideoOpen.value = false; videoUrl.value = '' }
const addToFavorites = (movie) => {
  const favorites = JSON.parse(localStorage.getItem('movieFavorites') || '[]')
  if (!favorites.find(fav => fav.id === movie.id)) {
    favorites.push(movie)
    localStorage.setItem('movieFavorites', JSON.stringify(favorites))
    alert('Added to My List!')
  } else alert('Already in My List!')
}

// --- ON MOUNT ---
onMounted(async () => {
  try {
    const gData = await getMovieGenres()
    genreList.value = gData.genres
  } catch (e) { console.error('Error loading genres', e) }

  fetchMovies()

  // Auto-rotate hero movie every 15 seconds
  setInterval(() => {
    if (movies.value.length > 0 && !selectedGenre.value && !route.query.q) {
      featuredIndex.value = (featuredIndex.value + 1) % movies.value.length
      currentFeaturedMovie.value = movies.value[featuredIndex.value]
    }
  }, 8000)
})
</script>

<style scoped>
/* Red Scrollbar */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #dc2626 #18181b; 
}
.custom-scrollbar::-webkit-scrollbar {
  height: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #18181b; 
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #dc2626; 
  border-radius: 10px;
  border: 2px solid #18181b; 
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #ef4444; 
}


/* Hero fade transition */
.fade-enter-active, .fade-leave-active { transition: opacity 0.8s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }



</style>
