<template>
  <div class="min-h-screen bg-black text-white pt-24 pb-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header with Filters -->
      <div class="mb-8">
        <h1 class="text-4xl font-black mb-6 text-white tracking-tight">TV Series</h1>
        
        <!-- Filter Tabs -->
        <div class="flex flex-wrap gap-3">
          <button
            v-for="filter in filters"
            :key="filter.id"
            @click="activeFilter = filter.id"
            :class="[
              'px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 uppercase tracking-wide',
              activeFilter === filter.id
                ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.5)]'
                : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
            ]"
          >
            {{ filter.name }}
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div v-for="i in 12" :key="i" class="aspect-[2/3] bg-zinc-900 animate-pulse rounded-lg"></div>
      </div>

      <!-- Series Grid -->
      <div v-else-if="series.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div
          v-for="show in series"
          :key="show.id"
          @click="openModal(show)"
          class="group cursor-pointer relative aspect-[2/3] rounded-lg overflow-hidden bg-zinc-900 hover:scale-105 transition-transform duration-300"
        >
          <img
            :src="getImageUrl(show.poster_path, 'poster', 'medium')"
            :alt="show.name"
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            <h3 class="font-bold text-sm mb-1 line-clamp-2">{{ show.name }}</h3>
            <div class="flex items-center gap-2 text-xs">
              <span class="text-yellow-500">★</span>
              <span>{{ show.vote_average?.toFixed(1) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16">
        <p class="text-zinc-500 text-lg">No TV series found</p>
      </div>

      <!-- Load More Button -->
      <div v-if="!loading && series.length > 0" class="mt-12 text-center">
        <button
          @click="loadMore"
          :disabled="loadingMore"
          class="px-8 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-all duration-300 shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide"
        >
          {{ loadingMore ? 'Loading...' : 'Load More' }}
        </button>
      </div>
    </div>

    <!-- Series Modal -->
    <div
      v-if="selectedSeries"
      @click="closeModal"
      class="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div
        @click.stop
        class="bg-zinc-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <!-- Backdrop Image -->
        <div class="relative h-64 md:h-96 overflow-hidden">
          <img
            :src="getImageUrl(selectedSeries.backdrop_path, 'backdrop', 'large')"
            :alt="selectedSeries.name"
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/50"></div>
          <button
            @click="closeModal"
            class="absolute top-4 right-4 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
          >
            <X class="w-6 h-6" />
          </button>
        </div>

        <!-- Content -->
        <div class="p-6 md:p-8 -mt-20 relative z-10">
          <h2 class="text-3xl md:text-4xl font-black mb-4">{{ selectedSeries.name }}</h2>
          
          <div class="flex flex-wrap items-center gap-4 mb-6 text-sm">
            <div class="flex items-center gap-2">
              <span class="text-yellow-500 text-lg">★</span>
              <span class="text-white font-bold">{{ selectedSeries.vote_average?.toFixed(1) }}</span>
            </div>
            <span class="text-zinc-400">{{ selectedSeries.first_air_date?.split('-')[0] }}</span>
          </div>

          <p class="text-zinc-300 leading-relaxed mb-8">{{ selectedSeries.overview }}</p>

          <!-- Action Buttons -->
          <div class="flex flex-wrap gap-3">
            <button
              @click="addToFavorites(selectedSeries)"
              class="flex-1 min-w-[200px] px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-all duration-300 shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] uppercase tracking-wide"
            >
              Add to My List
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { X } from 'lucide-vue-next'
import {
  getPopularSeries,
  getTopRatedSeries,
  getAiringTodaySeries,
  getOnTheAirSeries,
  getImageUrl
} from '../services/tmdb.js'

const series = ref([])
const loading = ref(true)
const loadingMore = ref(false)
const selectedSeries = ref(null)
const activeFilter = ref('popular')
const currentPage = ref(1)

const filters = [
  { id: 'popular', name: 'Popular', fetchFn: getPopularSeries },
  { id: 'top_rated', name: 'Top Rated', fetchFn: getTopRatedSeries },
  { id: 'airing_today', name: 'Airing Today', fetchFn: getAiringTodaySeries },
  { id: 'on_the_air', name: 'On The Air', fetchFn: getOnTheAirSeries }
]

const fetchSeries = async (append = false) => {
  try {
    if (append) {
      loadingMore.value = true
    } else {
      loading.value = true
      currentPage.value = 1
      series.value = []
    }

    const filter = filters.find(f => f.id === activeFilter.value)
    const data = await filter.fetchFn(currentPage.value)

    if (append) {
      series.value = [...series.value, ...data.results]
    } else {
      series.value = data.results
    }
  } catch (error) {
    console.error('Error fetching series:', error)
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

const loadMore = () => {
  currentPage.value++
  fetchSeries(true)
}

const openModal = (show) => {
  selectedSeries.value = show
}

const closeModal = () => {
  selectedSeries.value = null
}

const addToFavorites = (show) => {
  const favorites = JSON.parse(localStorage.getItem('movieFavorites') || '[]')
  
  if (!favorites.find(fav => fav.id === show.id)) {
    favorites.push({ ...show, mediaType: 'tv' })
    localStorage.setItem('movieFavorites', JSON.stringify(favorites))
    alert('Added to My List!')
  } else {
    alert('Already in My List!')
  }
}

watch(activeFilter, () => {
  fetchSeries()
})

onMounted(() => {
  fetchSeries()
})
</script>
