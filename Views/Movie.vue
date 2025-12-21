<template>
  <div class="min-h-screen bg-black text-white pb-16">

    <!-- Hero Section -->
    <div v-if="currentFeaturedMovie && !selectedGenre && !route.query.q" class="relative h-[85vh] w-full flex items-center justify-center overflow-hidden bg-black">
      <div class="absolute inset-0 z-0">
        <transition name="hero-fade" mode="out-in">
          <div :key="currentFeaturedMovie.id" class="absolute inset-0 w-full h-full">
            <div 
              class="absolute inset-0 bg-cover bg-center animate-ken-burns"
              :style="{ backgroundImage: `url(${getImageUrl(currentFeaturedMovie.backdrop_path, 'backdrop', 'original')})` }"
            ></div>
          </div>
        </transition>
        <div class="absolute inset-0 bg-black/40"></div>
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_80%,#000000_100%)]"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60"></div>
      </div>

      <div class="relative z-10 flex flex-col justify-center items-center text-center h-full max-w-7xl mx-auto px-4 space-y-6">
        <div class="animate-fade-in-down">
          <span class="px-3 py-1 rounded-full border border-white/20 bg-black/30 backdrop-blur-md text-xs font-medium text-gray-300 tracking-widest uppercase shadow-lg">
            Featured Selection
          </span>
        </div>
        <h1 class="text-5xl md:text-7xl lg:text-8xl font-black leading-tight tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-500 drop-shadow-2xl">
          {{ currentFeaturedMovie.title.toUpperCase() }}
        </h1>
        <p class="text-lg md:text-xl text-zinc-300 line-clamp-3 max-w-2xl font-light">
          {{ currentFeaturedMovie.overview }}
        </p>
        <div class="flex flex-wrap justify-center gap-4 mt-4">
          <button 
            @click="playMovie(currentFeaturedMovie)"
            class="px-8 py-4 bg-red-600 text-white text-lg font-bold rounded-xl hover:bg-red-700 transition-all shadow-[0_0_30px_rgba(220,38,38,0.4)] flex items-center gap-3 active:scale-95"
          >
            <Play class="w-6 h-6 fill-current" /> Watch Now
          </button>
          <button 
            @click="openModal(currentFeaturedMovie)"
            class="px-8 py-4 bg-white/10 backdrop-blur-md text-white text-lg font-bold rounded-xl hover:bg-white/20 transition-all border border-white/20 flex items-center gap-3 active:scale-95"
          >
            <Info class="w-6 h-6" /> More Info
          </button>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20" :class="{ '-mt-20': !selectedGenre && !route.query.q, 'pt-24': selectedGenre || route.query.q }">

      <!-- Sticky Filters -->
      <div class="sticky top-20 z-30 bg-zinc-900/90 backdrop-blur-xl p-4 md:p-6 rounded-2xl border border-white/10 shadow-2xl">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
          <h2 class="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <span class="w-2 h-8 bg-red-600 rounded-full"></span>
            <span v-if="route.query.q">Search: "{{ route.query.q }}"</span>
            <span v-else-if="selectedGenre">{{ getGenreName(selectedGenre) }}</span>
            <span v-else>Discover Movies</span>
          </h2>
          
          <div v-if="!route.query.q && !selectedGenre" class="flex flex-wrap gap-2">
            <button
              v-for="filter in filters"
              :key="filter.id"
              @click="setMainFilter(filter.id)"
              :class="[
                'px-5 py-2 rounded-full font-bold text-xs uppercase tracking-widest transition-all duration-300',
                activeFilter === filter.id ? 'bg-red-600 text-white shadow-lg' : 'bg-black/50 text-zinc-400 hover:text-white hover:bg-zinc-800'
              ]"
            >
              {{ filter.name }}
            </button>
          </div>
          
          <button v-if="selectedGenre" @click="clearGenre" class="px-4 py-2 bg-red-600/10 text-red-500 border border-red-600/20 rounded-full flex items-center gap-2 hover:bg-red-600 hover:text-white transition-all text-sm font-bold">
            <X class="w-4 h-4" /> Reset Filters
          </button>
        </div>

        <div v-if="!route.query.q" class="relative group">
          <div class="flex overflow-x-auto pb-2 gap-3 custom-scrollbar">
            <button
              v-for="genre in genreList"
              :key="genre.id"
              @click="setGenreFilter(genre.id)"
              :class="[
                'whitespace-nowrap px-5 py-2 rounded-xl text-sm font-bold border transition-all duration-300',
                selectedGenre === genre.id ? 'bg-white text-black border-white shadow-lg' : 'bg-black/40 border-zinc-800 text-zinc-400 hover:border-zinc-500 hover:text-white'
              ]"
            >
              {{ genre.name }}
            </button>
          </div>
        </div>
      </div>

      <!-- Movies Grid -->
      <div v-if="loading" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mt-6">
        <div v-for="i in 12" :key="i" class="aspect-[2/3] bg-zinc-900/50 animate-pulse rounded-2xl border border-white/5"></div>
      </div>

      <div v-else-if="movies.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mt-6">
        <div
          v-for="movie in movies"
          :key="movie.id"
          class="group relative aspect-[2/3] rounded-xl overflow-hidden bg-zinc-900 cursor-pointer transition-all duration-500 hover:z-10 lg:hover:scale-110 shadow-2xl"
        >
          <img
            :src="getImageUrl(movie.poster_path, 'poster', 'medium')"
            :alt="movie.title"
            class="w-full h-full object-cover transition-transform duration-700"
            loading="lazy"
          />
          
          <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-end p-4 text-center">
            <h3 class="font-bold text-white text-xs mb-3 line-clamp-2">{{ movie.title }}</h3>
            <div class="flex flex-col gap-2 w-full">
              <button @click.stop="playMovie(movie)" class="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-bold text-[10px] uppercase flex items-center justify-center gap-2 transition-all active:scale-90">
                <Play class="w-3 h-3 fill-current" /> Watch
              </button>
              <button @click.stop="openModal(movie)" class="w-full bg-zinc-800/90 backdrop-blur-md hover:bg-zinc-700 text-white py-2 rounded-lg font-bold text-[10px] uppercase flex items-center justify-center gap-2 transition-all border border-white/10 active:scale-90">
                <Info class="w-3 h-3" /> Info
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Load More -->
      <div v-if="!loading && movies.length > 0" class="mt-20 text-center">
        <button @click="loadMore" :disabled="loadingMore" class="group relative px-12 py-4 bg-zinc-900 text-white font-black rounded-full overflow-hidden transition-all border border-white/10 hover:border-red-600">
          <span class="relative z-10">{{ loadingMore ? 'SYNCHRONIZING...' : 'LOAD MORE MOVIES' }}</span>
          <div class="absolute inset-0 bg-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        </button>
      </div>
    </div>

    <!-- Movie Modal -->
    <div v-if="selectedMovie" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/95 backdrop-blur-md" @click="closeModal"></div>
      <div class="relative bg-zinc-900 w-full max-w-5xl rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col md:flex-row max-h-[90vh] border border-white/10">

        <button @click="closeModal" class="absolute top-6 right-6 z-30 p-2 bg-black/50 rounded-full hover:bg-red-600 text-white transition-all active:scale-90">
          <X class="w-6 h-6" />
        </button>

        <!-- Poster always visible -->
        <div class="w-full md:w-2/5 flex-shrink-0 relative h-80 md:h-auto">
          <img 
            :src="getImageUrl(selectedMovie.poster_path, 'poster', 'large')" 
            class="w-full h-full object-cover rounded-t-3xl md:rounded-none"
            alt="Movie poster"
          />
          <div class="absolute inset-0 bg-gradient-to-r from-transparent to-zinc-900"></div>
        </div>

        <!-- Movie Info -->
        <div class="flex-1 p-6 md:p-12 overflow-y-auto flex flex-col">
          <h2 class="text-3xl md:text-6xl font-black mb-4 tracking-tighter">{{ selectedMovie.title }}</h2>
          <div class="flex items-center gap-4 text-zinc-400 text-sm font-bold mb-6">
            <span class="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-white">
              {{ selectedMovie.release_date?.split('-')[0] || 'N/A' }}
            </span>
            <span class="flex items-center gap-1 text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-lg border border-yellow-500/20">
              <Star class="w-4 h-4 fill-current"/> {{ selectedMovie.vote_average?.toFixed(1) || 'N/A' }}
            </span>
          </div>

          <p class="text-zinc-300 text-base md:text-lg leading-relaxed mb-6 font-light">
            {{ selectedMovie.overview || 'No overview available.' }}
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto">
            <button @click="playMovie(selectedMovie)" class="col-span-1 sm:col-span-2 py-4 bg-red-600 text-white font-black rounded-2xl hover:bg-red-700 transition-all shadow-xl flex justify-center items-center gap-3 active:scale-95 transform hover:-translate-y-1">
              <Play class="w-6 h-6 fill-current" /> WATCH NOW
            </button>

            <!-- View Trailer - Always clickable -->
            <button 
              @click="playTrailer(selectedMovie)"
              class="py-3 bg-zinc-800 text-white font-bold rounded-2xl hover:bg-zinc-700 transition-all flex justify-center items-center gap-2 active:scale-95 border border-white/5 transform hover:-translate-y-1"
            >
              <Youtube class="w-5 h-5 text-red-500" /> View Trailer
            </button>

            <!-- Add/Remove from List - Toggle button -->
            <button 
              @click="toggleFavorite(selectedMovie)"
              class="py-3 bg-zinc-800 text-white font-bold rounded-2xl hover:bg-zinc-700 transition-all flex justify-center items-center gap-2 active:scale-95 border border-white/5 transform hover:-translate-y-1"
            >
              <Plus class="w-5 h-5 text-blue-500" />
              {{ isInFavorites(selectedMovie) ? 'Remove From List' : 'Add To List' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Video Overlay - Now handles no-trailer case gracefully -->
    <div v-if="isVideoOpen" class="fixed inset-0 z-[100] bg-black flex flex-col">
      <div class="flex justify-between items-center p-4 bg-black/90 backdrop-blur border-b border-white/5">
        <span class="font-bold text-sm tracking-widest">
          <span class="text-red-600">NOW STREAMING:</span> {{ currentVideoTitle.toUpperCase() }}
        </span>
        <button @click="closeVideo" class="p-2 bg-zinc-800 rounded-full hover:bg-white hover:text-black transition-all">
          <X class="w-5 h-5" />
        </button>
      </div>
      <div class="flex-1 relative">
        <!-- Trailer iframe -->
        <iframe 
          v-if="hasValidTrailer"
          :src="videoUrl" 
          class="absolute inset-0 w-full h-full border-0" 
          allowfullscreen 
          allow="autoplay"
        ></iframe>

        <!-- No trailer message -->
        <div v-else class="absolute inset-0 flex items-center justify-center text-center px-8">
          <div>
            <p class="text-3xl font-bold mb-4 text-white">No Trailer Available</p>
            <p class="text-zinc-400 text-lg">Sorry, there is no trailer for this movie at the moment.</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
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
const movies = ref([])
const genreList = ref([])
const loading = ref(true)
const loadingMore = ref(false)
const selectedMovie = ref(null)
const featuredIndex = ref(0)
const currentFeaturedMovie = ref(null)
const activeFilter = ref('popular')
const selectedGenre = ref(null)
const currentPage = ref(1)
const isVideoOpen = ref(false)
const videoUrl = ref('')
const currentVideoTitle = ref('')
const hasValidTrailer = ref(false) // New: track if we have a real trailer

const filters = [
  { id: 'popular', name: 'Popular', fetchFn: getPopularMovies },
  { id: 'top_rated', name: 'Top Rated', fetchFn: getTopRatedMovies },
  { id: 'now_playing', name: 'Now Playing', fetchFn: getNowPlayingMovies },
  { id: 'upcoming', name: 'Upcoming', fetchFn: getUpcomingMovies }
]

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
    } else if (selectedGenre.value) {
      data = await getMoviesByGenre(selectedGenre.value, currentPage.value)
    } else {
      const filter = filters.find(f => f.id === activeFilter.value) || filters[0]
      data = await filter.fetchFn(currentPage.value)
    }
    
    if (append) movies.value = [...movies.value, ...data.results]
    else {
      movies.value = data.results
      if (!route.query.q && !selectedGenre.value && activeFilter.value === 'popular') {
        currentFeaturedMovie.value = movies.value[0]
      }
    }
  } catch (error) { console.error(error) }
  finally { loading.value = false; loadingMore.value = false }
}

const setGenreFilter = (id) => { selectedGenre.value = id; activeFilter.value = null; fetchMovies() }
const setMainFilter = (id) => { activeFilter.value = id; selectedGenre.value = null; fetchMovies() }
const clearGenre = () => { selectedGenre.value = null; activeFilter.value = 'popular'; fetchMovies() }
const getGenreName = (id) => genreList.value.find(g => g.id === id)?.name || 'Genre'

watch(() => route.query.q, () => fetchMovies())

const playMovie = (movie) => {
  currentVideoTitle.value = movie.title
  videoUrl.value = `https://api.themoviedb.org/3${movie.id}`
  hasValidTrailer.value = true
  isVideoOpen.value = true
  selectedMovie.value = null
}

const playTrailer = async (movie) => {
  try {
    const data = await getMovieVideos(movie.id)
    const trailer = data.results.find(v => v.type === 'Trailer' && v.site === 'YouTube') ||
                    data.results.find(v => v.type === 'Teaser' && v.site === 'YouTube') ||
                    data.results.find(v => v.site === 'YouTube')

    if (trailer) {
      currentVideoTitle.value = `${movie.title} - Trailer`
      videoUrl.value = `https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`
      hasValidTrailer.value = true
    } else {
      currentVideoTitle.value = movie.title
      videoUrl.value = ''
      hasValidTrailer.value = false
    }
  } catch (error) {
    console.error('Failed to load trailer:', error)
    currentVideoTitle.value = movie.title
    videoUrl.value = ''
    hasValidTrailer.value = false
  }

  isVideoOpen.value = true
  selectedMovie.value = null
}

const isInFavorites = (movie) => {
  const favorites = JSON.parse(localStorage.getItem('movieFavorites') || '[]')
  return favorites.some(f => f.id === movie.id)
}

const toggleFavorite = (movie) => {
  let favorites = JSON.parse(localStorage.getItem('movieFavorites') || '[]')
  const index = favorites.findIndex(f => f.id === movie.id)

  if (index > -1) {
    favorites.splice(index, 1)
    alert('Removed from My List!')
  } else {
    favorites.push(movie)
    alert('Added to My List!')
  }

  localStorage.setItem('movieFavorites', JSON.stringify(favorites))
}

const openModal = (movie) => selectedMovie.value = movie
const closeModal = () => selectedMovie.value = null
const closeVideo = () => { 
  isVideoOpen.value = false
  videoUrl.value = ''
  hasValidTrailer.value = false
}
const loadMore = () => { currentPage.value++; fetchMovies(true) }

onMounted(async () => {
  const gData = await getMovieGenres()
  genreList.value = gData.genres
  fetchMovies()
  setInterval(() => {
    if (movies.value.length > 0 && !selectedGenre.value && !route.query.q) {
      featuredIndex.value = (featuredIndex.value + 1) % 10
      currentFeaturedMovie.value = movies.value[featuredIndex.value]
    }
  }, 8000)
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { height: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #dc2626; border-radius: 10px; }
</style>